package com.finflow.backend.repository;

import com.finflow.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TransactionRepository extends JpaRepository<Transaction, UUID>, JpaSpecificationExecutor<Transaction> {
    List<Transaction> findByUserIdOrderByTransactionDateDesc(UUID userId);
    
    List<Transaction> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(UUID userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.category.id = :categoryId AND t.transactionDate BETWEEN :startDate AND :endDate")
    List<Transaction> findByUserIdAndCategoryIdAndDateBetween(@Param("userId") UUID userId, @Param("categoryId") UUID categoryId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
