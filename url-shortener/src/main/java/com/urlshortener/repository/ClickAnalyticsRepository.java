package com.urlshortener.repository;

import com.urlshortener.model.ClickAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickAnalyticsRepository extends JpaRepository<ClickAnalytics, Long> {

    List<ClickAnalytics> findByUrlIdOrderByClickedAtDesc(Long urlId);

    long countByUrlId(Long urlId);

    @Query("SELECT DATE(c.clickedAt) as date, COUNT(c) as count FROM ClickAnalytics c " +
            "WHERE c.url.id = :urlId AND c.clickedAt >= :since GROUP BY DATE(c.clickedAt) ORDER BY DATE(c.clickedAt)")
    List<Object[]> findDailyClicksByUrlId(@Param("urlId") Long urlId, @Param("since") LocalDateTime since);

    @Query("SELECT c.referer, COUNT(c) as count FROM ClickAnalytics c " +
            "WHERE c.url.id = :urlId GROUP BY c.referer ORDER BY count DESC")
    List<Object[]> findRefererStatsByUrlId(@Param("urlId") Long urlId);
}
