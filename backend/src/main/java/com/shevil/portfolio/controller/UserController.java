package com.shevil.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shevil.portfolio.model.User;
import com.shevil.portfolio.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOptional = userService.getUserById(id);

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get()); // Return the user if found
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User Not Found");
            errorResponse.put("message", "User with ID " + id + " does not exist");
            errorResponse.put("status", HttpStatus.NOT_FOUND.value());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        if (userService.userExists(user.getUsername())) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Conflict");
            errorResponse.put("message", "User with this username already exists!");
            errorResponse.put("status", HttpStatus.CONFLICT.value());

            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }

        User savedUser = userService.saveUser(user);

        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("message", "User created successfully!");
        successResponse.put("user", savedUser);
        successResponse.put("status", HttpStatus.CREATED.value());

        return ResponseEntity.status(HttpStatus.CREATED).body(successResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userService.userExistsById(id)) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "User with ID " + id + " does not exist");
            errorResponse.put("status", HttpStatus.NOT_FOUND.value());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }

        userService.deleteUser(id);

        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("message", "User deleted successfully!");
        successResponse.put("status", HttpStatus.OK.value());

        return ResponseEntity.ok(successResponse);
    }

}
