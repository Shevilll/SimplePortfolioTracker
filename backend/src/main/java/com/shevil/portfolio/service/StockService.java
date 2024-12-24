package com.shevil.portfolio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shevil.portfolio.model.Stock;
import com.shevil.portfolio.repository.StockRepository;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {
    private final StockRepository stockRepository;

    @Autowired
    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public List<Stock> getStocks() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockById(Long id) {
        return stockRepository.findById(id);
    }

    public Stock saveStock(Stock stock) {
        return stockRepository.save(stock);
    }

    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }

    public List<Stock> getStocksByUserId(Long userId) {
        return stockRepository.findByUserId(userId);
    }

    public void deleteStocksByUserId(Long userId) {
        List<Stock> stocks = stockRepository.findByUserId(userId);
        if (!stocks.isEmpty()) {
            stockRepository.deleteAll(stocks);
        }
    }

    public Stock updateStock(Long id, Stock stock) {
        Stock existingStock = stockRepository.findById(id).orElse(null);
        if (existingStock != null) {
            existingStock.setSymbol(stock.getSymbol());
            existingStock.setQuantity(stock.getQuantity());
            existingStock.setPrice(stock.getPrice());
            return stockRepository.save(existingStock);
        }
        return null;
    }

}
