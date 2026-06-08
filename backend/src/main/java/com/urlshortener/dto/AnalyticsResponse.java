package com.urlshortener.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {
    private Long urlId;
    private String shortCode;
    private String originalUrl;
    private Long totalClicks;
    private List<DailyClick> dailyClicks;
    private Map<String, Long> refererStats;

    @Data
    @Builder
    public static class DailyClick {
        private String date;
        private Long count;
    }
}
