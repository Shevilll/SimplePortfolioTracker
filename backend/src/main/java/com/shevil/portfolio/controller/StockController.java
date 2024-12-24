package com.shevil.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shevil.portfolio.model.Stock;
import com.shevil.portfolio.service.StockService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stocks")
public class StockController {
    private final StockService stockService;

    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<Stock> getStocks() {
        return stockService.getStocks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStockById(@PathVariable Long id) {
        Optional<Stock> stockOptional = stockService.getStockById(id);
        if (stockOptional.isPresent()) {
            return ResponseEntity.ok(stockOptional.get());
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "Stock with ID " + id + " does not exist");
            errorResponse.put("status", HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @PostMapping
    public Stock saveStock(@RequestBody Stock stock) {
        return stockService.saveStock(stock);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStock(@PathVariable Long id) {
        boolean stockExists = stockService.getStockById(id).isPresent();
        if (stockExists) {
            stockService.deleteStock(id);
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("message", "Stock with ID " + id + " deleted successfully");
            successResponse.put("status", HttpStatus.OK.value());
            return ResponseEntity.status(HttpStatus.OK).body(successResponse);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "Stock with ID " + id + " does not exist");
            errorResponse.put("status", HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getStocksByUserId(@PathVariable Long userId) {
        List<Stock> stocks = stockService.getStocksByUserId(userId);
        if (stocks.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "No stocks found for user with ID " + userId);
            errorResponse.put("status", HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } else {
            return ResponseEntity.ok(stocks);
        }
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteStocksByUserId(@PathVariable Long userId) {
        List<Stock> stocks = stockService.getStocksByUserId(userId);
        if (stocks.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "No stocks found for user with ID " + userId);
            errorResponse.put("status", HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } else {
            stockService.deleteStocksByUserId(userId);
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("message", "All stocks for user with ID " + userId + " deleted successfully");
            successResponse.put("status", HttpStatus.OK.value());
            return ResponseEntity.status(HttpStatus.OK).body(successResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody Stock stock) {
        Optional<Stock> optionalStock = stockService.getStockById(id);
        if (!optionalStock.isPresent()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "Stock with ID " + id + " not found");
            errorResponse.put("status", HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }

        Stock existingStock = optionalStock.get();
        existingStock.setSymbol(stock.getSymbol());
        existingStock.setName(stock.getName());
        existingStock.setPrice(stock.getPrice());
        existingStock.setQuantity(stock.getQuantity());
        existingStock.setUser(stock.getUser());

        Stock updatedStock = stockService.saveStock(existingStock);

        return ResponseEntity.ok(updatedStock);
    }

}
