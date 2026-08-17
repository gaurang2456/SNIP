package com.urlshortener.controller;

import com.urlshortener.dto.AnalyticsResponse;
import com.urlshortener.dto.ApiResponse;
import com.urlshortener.dto.CreateUrlRequest;
import com.urlshortener.dto.UrlResponse;
import com.urlshortener.model.User;
import com.urlshortener.security.UserPrincipal;
import com.urlshortener.service.QrCodeService;
import com.urlshortener.service.UrlService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
@CrossOrigin(origins = "*")
public class UrlController {

    private final UrlService urlService;
    private final QrCodeService qrCodeService;

    public UrlController(UrlService urlService, QrCodeService qrCodeService) {
        this.urlService = urlService;
        this.qrCodeService = qrCodeService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UrlResponse>> createShortUrl(
            @Valid @RequestBody CreateUrlRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        User currentUser = principal != null ? principal.getUser() : null;
        UrlResponse response = urlService.createShortUrl(request, currentUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Short URL created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UrlResponse>>> getAllUrls(
            @AuthenticationPrincipal UserPrincipal principal) {

        Long userId = principal != null ? principal.getId() : null;
        List<UrlResponse> urls = (userId != null)
                ? urlService.getUrlsForUser(userId)
                : urlService.getAllUrls();

        return ResponseEntity.ok(ApiResponse.success(urls));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UrlResponse>> getUrlById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        Long userId = principal != null ? principal.getId() : null;
        UrlResponse url = (userId != null)
                ? urlService.getUrlByIdAndUser(id, userId)
                : urlService.getUrlById(id);

        return ResponseEntity.ok(ApiResponse.success(url));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        Long userId = principal != null ? principal.getId() : null;
        AnalyticsResponse analytics = urlService.getAnalytics(id, userId);

        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getQrCode(@PathVariable Long id) {
        UrlResponse url = urlService.getUrlById(id);
        byte[] qrCode = qrCodeService.generateQrCode(url.getShortUrl());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(qrCode.length);

        return new ResponseEntity<>(qrCode, headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUrl(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        Long userId = principal != null ? principal.getId() : null;
        urlService.deleteUrl(id, userId);

        return ResponseEntity.ok(ApiResponse.success("URL deleted successfully", null));
    }

    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<UrlResponse>>> getTopUrls(
            @AuthenticationPrincipal UserPrincipal principal) {

        Long userId = principal != null ? principal.getId() : null;
        List<UrlResponse> urls = urlService.getTopUrls(userId);

        return ResponseEntity.ok(ApiResponse.success(urls));
    }
}
