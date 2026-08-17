package com.urlshortener.service;

import com.urlshortener.dto.*;
import com.urlshortener.model.Url;
import com.urlshortener.model.User;
import com.urlshortener.repository.UrlRepository;
import com.urlshortener.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AuthAndUrlServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UrlService urlService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UrlRepository urlRepository;

    @BeforeEach
    void setUp() {
        urlRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testAnonymousUrlCreation() {
        CreateUrlRequest request = new CreateUrlRequest();
        request.setOriginalUrl("https://www.example.com");
        request.setCustomAlias("example-anon");
        request.setTitle("Example Anon");

        UrlResponse response = urlService.createShortUrl(request, null);

        assertNotNull(response);
        assertEquals("example-anon", response.getShortCode());
        assertNull(response.getUserId());

        Url savedUrl = urlRepository.findByShortCode("example-anon").orElse(null);
        assertNotNull(savedUrl);
        assertNull(savedUrl.getUser());
    }

    @Test
    void testUserRegistrationAndLogin() {
        RegisterRequest registerReq = new RegisterRequest("testuser@example.com", "password123", "password123");
        AuthResponse regResponse = authService.register(registerReq);

        assertNotNull(regResponse);
        assertNotNull(regResponse.getToken());
        assertEquals("testuser@example.com", regResponse.getEmail());

        LoginRequest loginReq = new LoginRequest("testuser@example.com", "password123");
        AuthResponse loginResponse = authService.login(loginReq);

        assertNotNull(loginResponse);
        assertNotNull(loginResponse.getToken());
        assertEquals("testuser@example.com", loginResponse.getEmail());
    }

    @Test
    void testAuthenticatedUrlCreation() {
        RegisterRequest registerReq = new RegisterRequest("user1@example.com", "password123", "password123");
        AuthResponse authRes = authService.register(registerReq);
        User user1 = userRepository.findById(authRes.getId()).orElseThrow();

        CreateUrlRequest request = new CreateUrlRequest();
        request.setOriginalUrl("https://www.google.com");
        request.setTitle("Google Search");

        UrlResponse response = urlService.createShortUrl(request, user1);

        assertNotNull(response);
        assertEquals(user1.getId(), response.getUserId());

        List<UrlResponse> userUrls = urlService.getUrlsForUser(user1.getId());
        assertEquals(1, userUrls.size());
        assertEquals(response.getShortCode(), userUrls.get(0).getShortCode());
    }

    @Test
    void testOwnershipAuthorization() {
        RegisterRequest regA = new RegisterRequest("usera@example.com", "password123", "password123");
        AuthResponse resA = authService.register(regA);
        User userA = userRepository.findById(resA.getId()).orElseThrow();

        RegisterRequest regB = new RegisterRequest("userb@example.com", "password123", "password123");
        AuthResponse resB = authService.register(regB);
        User userB = userRepository.findById(resB.getId()).orElseThrow();

        // User A creates URL 1
        CreateUrlRequest req1 = new CreateUrlRequest();
        req1.setOriginalUrl("https://www.usera.com");
        UrlResponse url1 = urlService.createShortUrl(req1, userA);

        // User B creates URL 2
        CreateUrlRequest req2 = new CreateUrlRequest();
        req2.setOriginalUrl("https://www.userb.com");
        UrlResponse url2 = urlService.createShortUrl(req2, userB);

        // User A gets their URLs -> gets URL 1, not URL 2
        List<UrlResponse> urlsA = urlService.getUrlsForUser(userA.getId());
        assertEquals(1, urlsA.size());
        assertEquals(url1.getShortCode(), urlsA.get(0).getShortCode());

        // User A can access URL 1
        assertNotNull(urlService.getUrlByIdAndUser(url1.getId(), userA.getId()));

        // User A attempts to access URL 2 -> throws AccessDeniedException
        assertThrows(AccessDeniedException.class, () -> {
            urlService.getUrlByIdAndUser(url2.getId(), userA.getId());
        });

        // User A attempts to get analytics for URL 2 -> throws AccessDeniedException
        assertThrows(AccessDeniedException.class, () -> {
            urlService.getAnalytics(url2.getId(), userA.getId());
        });

        // User A attempts to delete URL 2 -> throws AccessDeniedException
        assertThrows(AccessDeniedException.class, () -> {
            urlService.deleteUrl(url2.getId(), userA.getId());
        });
    }

    @Test
    void testPublicRedirect() {
        CreateUrlRequest request = new CreateUrlRequest();
        request.setOriginalUrl("https://www.publicsite.com");
        request.setCustomAlias("publicsite");

        urlService.createShortUrl(request, null);

        String resolved = urlService.resolveUrl("publicsite", "127.0.0.1", "JUnit", null);
        assertEquals("https://www.publicsite.com", resolved);
    }
}
