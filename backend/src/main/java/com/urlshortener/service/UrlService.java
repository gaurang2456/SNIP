package com.urlshortener.service;

import com.urlshortener.dto.AnalyticsResponse;
import com.urlshortener.dto.CreateUrlRequest;
import com.urlshortener.dto.UrlResponse;
import com.urlshortener.exception.CustomAliasAlreadyExistsException;
import com.urlshortener.exception.UrlExpiredException;
import com.urlshortener.exception.UrlNotFoundException;
import com.urlshortener.model.ClickAnalytics;
import com.urlshortener.model.Url;
import com.urlshortener.repository.ClickAnalyticsRepository;
import com.urlshortener.repository.UrlRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class UrlService {

    private static final Logger log = LoggerFactory.getLogger(UrlService.class);

    private final UrlRepository urlRepository;
    private final ClickAnalyticsRepository clickAnalyticsRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public UrlService(UrlRepository urlRepository,
                      ClickAnalyticsRepository clickAnalyticsRepository,
                      @Autowired(required = false) RedisTemplate<String, String> redisTemplate) {
        this.urlRepository = urlRepository;
        this.clickAnalyticsRepository = clickAnalyticsRepository;
        this.redisTemplate = redisTemplate;
    }

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.short-code-length:6}")
    private int shortCodeLength;

    @Value("${app.default-expiry-days:30}")
    private int defaultExpiryDays;

    @Value("${app.redis.url-ttl:3600}")
    private long redisTtl;

    private static final String REDIS_URL_PREFIX = "url:";
    private static final String CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    @Transactional
    public UrlResponse createShortUrl(CreateUrlRequest request) {
        // Validate custom alias uniqueness
        if (request.getCustomAlias() != null && !request.getCustomAlias().isBlank()) {
            if (urlRepository.existsByCustomAlias(request.getCustomAlias())) {
                throw new CustomAliasAlreadyExistsException("Custom alias '" + request.getCustomAlias() + "' is already taken");
            }
        }

        String shortCode = (request.getCustomAlias() != null && !request.getCustomAlias().isBlank())
                ? request.getCustomAlias()
                : generateUniqueShortCode();

        LocalDateTime expiresAt = null;
        if (request.getExpiryDays() != null && request.getExpiryDays() > 0) {
            expiresAt = LocalDateTime.now().plusDays(request.getExpiryDays());
        }

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .customAlias(request.getCustomAlias())
                .expiresAt(expiresAt)
                .title(request.getTitle())
                .build();

        url = urlRepository.save(url);

        // Cache in Redis
        cacheUrl(shortCode, request.getOriginalUrl());

        log.info("Created short URL: {} -> {}", shortCode, request.getOriginalUrl());
        return mapToResponse(url);
    }

    @Transactional
    public String resolveUrl(String shortCode, String ipAddress, String userAgent, String referer) {
        // Try Redis cache first
        try {
            if (redisTemplate != null) {
                String cachedUrl = redisTemplate.opsForValue().get(REDIS_URL_PREFIX + shortCode);
                if (cachedUrl != null) {
                    recordClickAsync(shortCode, ipAddress, userAgent, referer);
                    return cachedUrl;
                }
            }
        } catch (Exception e) {
            log.debug("Redis lookup skipped: {}", e.getMessage());
        }

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("Short URL not found: " + shortCode));

        if (!url.getIsActive()) {
            throw new UrlNotFoundException("This URL has been deactivated");
        }

        if (url.isExpired()) {
            throw new UrlExpiredException("This URL has expired");
        }

        // Cache it
        cacheUrl(shortCode, url.getOriginalUrl());

        // Record analytics
        recordClick(url, ipAddress, userAgent, referer);

        return url.getOriginalUrl();
    }

    private void recordClickAsync(String shortCode, String ipAddress, String userAgent, String referer) {
        urlRepository.findByShortCode(shortCode).ifPresent(url -> recordClick(url, ipAddress, userAgent, referer));
    }

    @Transactional
    protected void recordClick(Url url, String ipAddress, String userAgent, String referer) {
        urlRepository.incrementClickCount(url.getId());

        ClickAnalytics analytics = ClickAnalytics.builder()
                .url(url)
                .ipAddress(ipAddress)
                .userAgent(userAgent != null && userAgent.length() > 512 ? userAgent.substring(0, 512) : userAgent)
                .referer(referer != null && referer.length() > 512 ? referer.substring(0, 512) : referer)
                .build();

        clickAnalyticsRepository.save(analytics);
    }

    public List<UrlResponse> getAllUrls() {
        return urlRepository.findAllActive()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UrlResponse getUrlById(Long id) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL not found with id: " + id));
        return mapToResponse(url);
    }

    public AnalyticsResponse getAnalytics(Long id) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL not found with id: " + id));

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Object[]> dailyData = clickAnalyticsRepository.findDailyClicksByUrlId(id, thirtyDaysAgo);
        List<Object[]> refererData = clickAnalyticsRepository.findRefererStatsByUrlId(id);

        List<AnalyticsResponse.DailyClick> dailyClicks = dailyData.stream()
                .map(row -> AnalyticsResponse.DailyClick.builder()
                        .date(row[0].toString())
                        .count(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        Map<String, Long> refererStats = new LinkedHashMap<>();
        refererData.forEach(row -> {
            String referer = row[0] != null ? row[0].toString() : "Direct";
            refererStats.put(referer, ((Number) row[1]).longValue());
        });

        return AnalyticsResponse.builder()
                .urlId(url.getId())
                .shortCode(url.getShortCode())
                .originalUrl(url.getOriginalUrl())
                .totalClicks(url.getClickCount())
                .dailyClicks(dailyClicks)
                .refererStats(refererStats)
                .build();
    }

    @Transactional
    @CacheEvict(value = "urls", key = "#id")
    public void deleteUrl(Long id) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL not found with id: " + id));

        // Remove from Redis
        try {
            if (redisTemplate != null) {
                redisTemplate.delete(REDIS_URL_PREFIX + url.getShortCode());
            }
        } catch (Exception e) {
            log.debug("Redis delete skipped: {}", e.getMessage());
        }

        url.setIsActive(false);
        urlRepository.save(url);
        log.info("Deactivated URL with id: {}", id);
    }

    public List<UrlResponse> getTopUrls() {
        return urlRepository.findTopUrls()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Scheduled(cron = "0 0 * * * *") // Every hour
    @Transactional
    public void deactivateExpiredUrls() {
        List<Url> expiredUrls = urlRepository.findExpiredUrls(LocalDateTime.now());
        expiredUrls.forEach(url -> {
            url.setIsActive(false);
            try {
                if (redisTemplate != null) {
                    redisTemplate.delete(REDIS_URL_PREFIX + url.getShortCode());
                }
            } catch (Exception e) {
                log.debug("Redis delete skipped: {}", e.getMessage());
            }
        });
        if (!expiredUrls.isEmpty()) {
            urlRepository.saveAll(expiredUrls);
            log.info("Deactivated {} expired URLs", expiredUrls.size());
        }
    }

    private void cacheUrl(String shortCode, String originalUrl) {
        try {
            if (redisTemplate != null) {
                redisTemplate.opsForValue().set(REDIS_URL_PREFIX + shortCode, originalUrl, redisTtl, TimeUnit.SECONDS);
            }
        } catch (Exception e) {
            log.debug("Redis caching skipped: {}", e.getMessage());
        }
    }

    private String generateUniqueShortCode() {
        String code;
        do {
            code = generateRandomCode();
        } while (urlRepository.existsByShortCode(code));
        return code;
    }

    private String generateRandomCode() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder(shortCodeLength);
        for (int i = 0; i < shortCodeLength; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    private UrlResponse mapToResponse(Url url) {
        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .shortUrl(baseUrl + "/" + url.getShortCode())
                .customAlias(url.getCustomAlias())
                .clickCount(url.getClickCount())
                .createdAt(url.getCreatedAt())
                .expiresAt(url.getExpiresAt())
                .isActive(url.getIsActive())
                .title(url.getTitle())
                .expired(url.isExpired())
                .build();
    }
}
