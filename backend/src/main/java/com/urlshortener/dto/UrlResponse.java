package com.urlshortener.dto;

import java.time.LocalDateTime;

public class UrlResponse {
    private Long id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private String customAlias;
    private Long clickCount;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Boolean isActive;
    private String title;
    private boolean expired;

    public UrlResponse() {}

    public UrlResponse(Long id, String originalUrl, String shortCode, String shortUrl, String customAlias,
                       Long clickCount, LocalDateTime createdAt, LocalDateTime expiresAt, Boolean isActive,
                       String title, boolean expired) {
        this.id = id;
        this.originalUrl = originalUrl;
        this.shortCode = shortCode;
        this.shortUrl = shortUrl;
        this.customAlias = customAlias;
        this.clickCount = clickCount;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.isActive = isActive;
        this.title = title;
        this.expired = expired;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }

    public String getShortUrl() { return shortUrl; }
    public void setShortUrl(String shortUrl) { this.shortUrl = shortUrl; }

    public String getCustomAlias() { return customAlias; }
    public void setCustomAlias(String customAlias) { this.customAlias = customAlias; }

    public Long getClickCount() { return clickCount; }
    public void setClickCount(Long clickCount) { this.clickCount = clickCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean isExpired() { return expired; }
    public void setExpired(boolean expired) { this.expired = expired; }

    public static UrlResponseBuilder builder() {
        return new UrlResponseBuilder();
    }

    public static class UrlResponseBuilder {
        private Long id;
        private String originalUrl;
        private String shortCode;
        private String shortUrl;
        private String customAlias;
        private Long clickCount;
        private LocalDateTime createdAt;
        private LocalDateTime expiresAt;
        private Boolean isActive;
        private String title;
        private boolean expired;

        public UrlResponseBuilder id(Long id) { this.id = id; return this; }
        public UrlResponseBuilder originalUrl(String originalUrl) { this.originalUrl = originalUrl; return this; }
        public UrlResponseBuilder shortCode(String shortCode) { this.shortCode = shortCode; return this; }
        public UrlResponseBuilder shortUrl(String shortUrl) { this.shortUrl = shortUrl; return this; }
        public UrlResponseBuilder customAlias(String customAlias) { this.customAlias = customAlias; return this; }
        public UrlResponseBuilder clickCount(Long clickCount) { this.clickCount = clickCount; return this; }
        public UrlResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UrlResponseBuilder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }
        public UrlResponseBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public UrlResponseBuilder title(String title) { this.title = title; return this; }
        public UrlResponseBuilder expired(boolean expired) { this.expired = expired; return this; }

        public UrlResponse build() {
            return new UrlResponse(id, originalUrl, shortCode, shortUrl, customAlias, clickCount, createdAt, expiresAt, isActive, title, expired);
        }
    }
}
