package com.urlshortener.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "urls")
public class Url {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_url", nullable = false, length = 2048)
    private String originalUrl;

    @Column(name = "short_code", nullable = false, unique = true, length = 50)
    private String shortCode;

    @Column(name = "custom_alias", length = 50)
    private String customAlias;

    @Column(name = "click_count", nullable = false)
    private Long clickCount = 0L;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "title", length = 255)
    private String title;

    public Url() {}

    public Url(Long id, String originalUrl, String shortCode, String customAlias, Long clickCount,
               LocalDateTime createdAt, LocalDateTime expiresAt, Boolean isActive, String title) {
        this.id = id;
        this.originalUrl = originalUrl;
        this.shortCode = shortCode;
        this.customAlias = customAlias;
        this.clickCount = clickCount != null ? clickCount : 0L;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.isActive = isActive != null ? isActive : true;
        this.title = title;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }

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

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (clickCount == null) {
            clickCount = 0L;
        }
        if (isActive == null) {
            isActive = true;
        }
    }

    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    public static UrlBuilder builder() {
        return new UrlBuilder();
    }

    public static class UrlBuilder {
        private Long id;
        private String originalUrl;
        private String shortCode;
        private String customAlias;
        private Long clickCount = 0L;
        private LocalDateTime createdAt;
        private LocalDateTime expiresAt;
        private Boolean isActive = true;
        private String title;

        public UrlBuilder id(Long id) { this.id = id; return this; }
        public UrlBuilder originalUrl(String originalUrl) { this.originalUrl = originalUrl; return this; }
        public UrlBuilder shortCode(String shortCode) { this.shortCode = shortCode; return this; }
        public UrlBuilder customAlias(String customAlias) { this.customAlias = customAlias; return this; }
        public UrlBuilder clickCount(Long clickCount) { this.clickCount = clickCount; return this; }
        public UrlBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UrlBuilder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }
        public UrlBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public UrlBuilder title(String title) { this.title = title; return this; }

        public Url build() {
            return new Url(id, originalUrl, shortCode, customAlias, clickCount, createdAt, expiresAt, isActive, title);
        }
    }
}
