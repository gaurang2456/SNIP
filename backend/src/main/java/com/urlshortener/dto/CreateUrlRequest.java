package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public class CreateUrlRequest {

    @NotBlank(message = "Original URL is required")
    @URL(message = "Must be a valid URL")
    private String originalUrl;

    @Size(min = 3, max = 30, message = "Custom alias must be between 3 and 30 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]*$", message = "Custom alias can only contain letters, numbers, hyphens, and underscores")
    private String customAlias;

    private Integer expiryDays;

    private String title;

    public CreateUrlRequest() {}

    public CreateUrlRequest(String originalUrl, String customAlias, Integer expiryDays, String title) {
        this.originalUrl = originalUrl;
        this.customAlias = customAlias;
        this.expiryDays = expiryDays;
        this.title = title;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getCustomAlias() {
        return customAlias;
    }

    public void setCustomAlias(String customAlias) {
        this.customAlias = customAlias;
    }

    public Integer getExpiryDays() {
        return expiryDays;
    }

    public void setExpiryDays(Integer expiryDays) {
        this.expiryDays = expiryDays;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
