package com.finflow.backend.repository;

import com.finflow.backend.entity.PodExpenseShare;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PodExpenseShareRepository extends JpaRepository<PodExpenseShare, UUID> {
    List<PodExpenseShare> findByPodIdAndSettledFalse(UUID podId);
    List<PodExpenseShare> findByUserIdAndSettledFalse(UUID userId);
}
