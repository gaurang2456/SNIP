package com.urlshortener.repository;

import com.urlshortener.model.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);

    Optional<Url> findByCustomAlias(String customAlias);

    boolean existsByShortCode(String shortCode);

    boolean existsByCustomAlias(String customAlias);

    @Modifying
    @Query("UPDATE Url u SET u.clickCount = u.clickCount + 1 WHERE u.id = :id")
    void incrementClickCount(@Param("id") Long id);

    @Query("SELECT u FROM Url u WHERE u.isActive = true ORDER BY u.createdAt DESC")
    List<Url> findAllActive();

    @Query("SELECT u FROM Url u WHERE u.user.id = :userId AND u.isActive = true ORDER BY u.createdAt DESC")
    List<Url> findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(@Param("userId") Long userId);

    Optional<Url> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT u FROM Url u WHERE u.expiresAt < :now AND u.isActive = true")
    List<Url> findExpiredUrls(@Param("now") LocalDateTime now);

    @Query("SELECT u FROM Url u ORDER BY u.clickCount DESC LIMIT 10")
    List<Url> findTopUrls();

    @Query("SELECT u FROM Url u WHERE u.user.id = :userId AND u.isActive = true ORDER BY u.clickCount DESC LIMIT 10")
    List<Url> findTopUrlsByUserId(@Param("userId") Long userId);
}
