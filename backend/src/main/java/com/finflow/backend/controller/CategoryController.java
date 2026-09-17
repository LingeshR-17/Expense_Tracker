package com.finflow.backend.controller;

import com.finflow.backend.dto.CategoryDto;
import com.finflow.backend.dto.CategoryRequest;
import com.finflow.backend.security.UserPrincipal;
import com.finflow.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(categoryService.getUserCategories(userPrincipal.getId()));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @RequestBody CategoryRequest request) {
        CategoryDto category = categoryService.createCategory(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }
}
