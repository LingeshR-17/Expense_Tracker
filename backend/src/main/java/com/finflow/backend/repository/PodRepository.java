package com.finflow.backend.repository;

import com.finflow.backend.entity.Pod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PodRepository extends JpaRepository<Pod, UUID> {
}
