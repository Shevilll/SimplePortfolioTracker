package com.shevil.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.shevil.portfolio.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}