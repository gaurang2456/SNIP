package com.urlshortener.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {
    private Long urlId;
    private String shortCode;
    private String originalUrl;
    private Long totalClicks;
    private List<DailyClick> dailyClicks;
    private Map<String, Long> refererStats;

    public AnalyticsResponse() {}

    public AnalyticsResponse(Long urlId, String shortCode, String originalUrl, Long totalClicks,
                             List<DailyClick> dailyClicks, Map<String, Long> refererStats) {
        this.urlId = urlId;
        this.shortCode = shortCode;
        this.originalUrl = originalUrl;
        this.totalClicks = totalClicks;
        this.dailyClicks = dailyClicks;
        this.refererStats = refererStats;
    }

    public Long getUrlId() { return urlId; }
    public void setUrlId(Long urlId) { this.urlId = urlId; }

    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public Long getTotalClicks() { return totalClicks; }
    public void setTotalClicks(Long totalClicks) { this.totalClicks = totalClicks; }

    public List<DailyClick> getDailyClicks() { return dailyClicks; }
    public void setDailyClicks(List<DailyClick> dailyClicks) { this.dailyClicks = dailyClicks; }

    public Map<String, Long> getRefererStats() { return refererStats; }
    public void setRefererStats(Map<String, Long> refererStats) { this.refererStats = refererStats; }

    public static AnalyticsResponseBuilder builder() {
        return new AnalyticsResponseBuilder();
    }

    public static class AnalyticsResponseBuilder {
        private Long urlId;
        private String shortCode;
        private String originalUrl;
        private Long totalClicks;
        private List<DailyClick> dailyClicks;
        private Map<String, Long> refererStats;

        public AnalyticsResponseBuilder urlId(Long urlId) { this.urlId = urlId; return this; }
        public AnalyticsResponseBuilder shortCode(String shortCode) { this.shortCode = shortCode; return this; }
        public AnalyticsResponseBuilder originalUrl(String originalUrl) { this.originalUrl = originalUrl; return this; }
        public AnalyticsResponseBuilder totalClicks(Long totalClicks) { this.totalClicks = totalClicks; return this; }
        public AnalyticsResponseBuilder dailyClicks(List<DailyClick> dailyClicks) { this.dailyClicks = dailyClicks; return this; }
        public AnalyticsResponseBuilder refererStats(Map<String, Long> refererStats) { this.refererStats = refererStats; return this; }

        public AnalyticsResponse build() {
            return new AnalyticsResponse(urlId, shortCode, originalUrl, totalClicks, dailyClicks, refererStats);
        }
    }

    public static class DailyClick {
        private String date;
        private Long count;

        public DailyClick() {}

        public DailyClick(String date, Long count) {
            this.date = date;
            this.count = count;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public Long getCount() { return count; }
        public void setCount(Long count) { this.count = count; }

        public static DailyClickBuilder builder() {
            return new DailyClickBuilder();
        }

        public static class DailyClickBuilder {
            private String date;
            private Long count;

            public DailyClickBuilder date(String date) { this.date = date; return this; }
            public DailyClickBuilder count(Long count) { this.count = count; return this; }

            public DailyClick build() {
                return new DailyClick(date, count);
            }
        }
    }
}
