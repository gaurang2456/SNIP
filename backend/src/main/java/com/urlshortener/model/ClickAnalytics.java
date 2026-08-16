package com.urlshortener.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "click_analytics")
public class ClickAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "url_id", nullable = false)
    private Url url;

    @Column(name = "clicked_at", nullable = false)
    private LocalDateTime clickedAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(name = "referer", length = 512)
    private String referer;

    @Column(name = "country", length = 100)
    private String country;

    public ClickAnalytics() {}

    public ClickAnalytics(Long id, Url url, LocalDateTime clickedAt, String ipAddress, String userAgent,
                          String referer, String country) {
        this.id = id;
        this.url = url;
        this.clickedAt = clickedAt;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.referer = referer;
        this.country = country;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Url getUrl() { return url; }
    public void setUrl(Url url) { this.url = url; }

    public LocalDateTime getClickedAt() { return clickedAt; }
    public void setClickedAt(LocalDateTime clickedAt) { this.clickedAt = clickedAt; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getReferer() { return referer; }
    public void setReferer(String referer) { this.referer = referer; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    @PrePersist
    protected void onCreate() {
        if (clickedAt == null) {
            clickedAt = LocalDateTime.now();
        }
    }

    public static ClickAnalyticsBuilder builder() {
        return new ClickAnalyticsBuilder();
    }

    public static class ClickAnalyticsBuilder {
        private Long id;
        private Url url;
        private LocalDateTime clickedAt;
        private String ipAddress;
        private String userAgent;
        private String referer;
        private String country;

        public ClickAnalyticsBuilder id(Long id) { this.id = id; return this; }
        public ClickAnalyticsBuilder url(Url url) { this.url = url; return this; }
        public ClickAnalyticsBuilder clickedAt(LocalDateTime clickedAt) { this.clickedAt = clickedAt; return this; }
        public ClickAnalyticsBuilder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }
        public ClickAnalyticsBuilder userAgent(String userAgent) { this.userAgent = userAgent; return this; }
        public ClickAnalyticsBuilder referer(String referer) { this.referer = referer; return this; }
        public ClickAnalyticsBuilder country(String country) { this.country = country; return this; }

        public ClickAnalytics build() {
            return new ClickAnalytics(id, url, clickedAt, ipAddress, userAgent, referer, country);
        }
    }
}
