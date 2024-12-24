package com.shevil.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import com.shevil.portfolio.model.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}