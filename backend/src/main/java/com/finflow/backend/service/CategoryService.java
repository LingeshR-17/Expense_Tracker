package com.finflow.backend.service;

import com.finflow.backend.dto.CategoryDto;
import com.finflow.backend.dto.CategoryRequest;
import com.finflow.backend.entity.Category;
import com.finflow.backend.entity.User;
import com.finflow.backend.repository.CategoryRepository;
import com.finflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getUserCategories(UUID userId) {
        return categoryRepository.findByUserIdOrIsCustomFalse(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(UUID userId, CategoryRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Category category = Category.builder()
                .user(user)
                .name(request.getName())
                .icon(request.getIcon())
                .color(request.getColor())
                .isCustom(true)
                .build();
        return mapToDto(categoryRepository.save(category));
    }

    private CategoryDto mapToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setIcon(category.getIcon());
        dto.setColor(category.getColor());
        dto.setIsCustom(category.getIsCustom());
        return dto;
    }
}
