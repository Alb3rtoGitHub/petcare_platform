package com.equipo11.petcare.controller;

import com.github.benmanes.caffeine.cache.Cache;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/api/v1/caches")
@RestController
@Slf4j
public class CacheController {
  private final CacheManager cacheManager;

  public CacheController(CacheManager cacheManager) {
    this.cacheManager = cacheManager;
  }

  @GetMapping("/{cache-name}")
  public Map<Object, Object> getAllCountriesMap(@PathVariable(value = "cache-name") String cacheName) {
    log.info("Fetching all countries from cache: {}", cacheName);
    Cache<Object, Object> cache = (Cache<Object, Object>) cacheManager.getCache(cacheName).getNativeCache();
    return cache.asMap();
  }
}
