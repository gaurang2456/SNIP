package com.urlshortener.controller;

import com.urlshortener.dto.AnalyticsResponse;
import com.urlshortener.dto.ApiResponse;
import com.urlshortener.dto.CreateUrlRequest;
import com.urlshortener.dto.UrlResponse;
import com.urlshortener.service.QrCodeService;
import com.urlshortener.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UrlController {

    private final UrlService urlService;
    private final QrCodeService qrCodeService;

    @PostMapping
    public ResponseEntity<ApiResponse<UrlResponse>> createShortUrl(
            @Valid @RequestBody CreateUrlRequest request) {
        UrlResponse response = urlService.createShortUrl(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Short URL created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UrlResponse>>> getAllUrls() {
        List<UrlResponse> urls = urlService.getAllUrls();
        return ResponseEntity.ok(ApiResponse.success(urls));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UrlResponse>> getUrlById(@PathVariable Long id) {
        UrlResponse url = urlService.getUrlById(id);
        return ResponseEntity.ok(ApiResponse.success(url));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics(@PathVariable Long id) {
        AnalyticsResponse analytics = urlService.getAnalytics(id);
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
    public ResponseEntity<ApiResponse<Void>> deleteUrl(@PathVariable Long id) {
        urlService.deleteUrl(id);
        return ResponseEntity.ok(ApiResponse.success("URL deleted successfully", null));
    }

    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<UrlResponse>>> getTopUrls() {
        List<UrlResponse> urls = urlService.getTopUrls();
        return ResponseEntity.ok(ApiResponse.success(urls));
    }
}
