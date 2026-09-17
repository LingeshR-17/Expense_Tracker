package com.finflow.backend.repository;

import com.finflow.backend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    List<Budget> findByUserIdAndBudgetMonthAndBudgetYear(UUID userId, Integer month, Integer year);
    Optional<Budget> findByUserIdAndCategoryIdAndBudgetMonthAndBudgetYear(UUID userId, UUID categoryId, Integer month, Integer year);
}
