package com.equipo11.petcare.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

  @Value("${cache.users.info.ttl:50}")
  private Long cacheUsersInfoTtl;

  @Value("${cache.users.info.max-size:1000}")
  private Long cacheUsersInfoMaxSize;

  public static final String USERS_INFO_CACHE = "USERS_INFO_CACHE";

  @Bean
  CacheManager cacheManager() {
    List<CaffeineCache> caches = new ArrayList<CaffeineCache>();
    caches.add(buildCache(USERS_INFO_CACHE, cacheUsersInfoTtl, TimeUnit.HOURS, cacheUsersInfoMaxSize));
    SimpleCacheManager simpleCacheManager = new SimpleCacheManager();
    simpleCacheManager.setCaches(caches);
    return simpleCacheManager;
  }

  private static CaffeineCache buildCache(String name, Long ttl, TimeUnit timeUnit, Long maxSize) {
    return new CaffeineCache(name, Caffeine.newBuilder()
        .expireAfterWrite(ttl, timeUnit)
        .maximumSize(maxSize)
        .build());
  }
}
