package com.finflow.backend.repository;

import com.finflow.backend.entity.RecurringRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface RecurringRuleRepository extends JpaRepository<RecurringRule, UUID> {
    List<RecurringRule> findByNextDueDateBefore(LocalDate date);
    
    @Query("SELECT r FROM RecurringRule r WHERE r.transaction.user.id = :userId")
    List<RecurringRule> findByUserId(@org.springframework.data.repository.query.Param("userId") UUID userId);
}
