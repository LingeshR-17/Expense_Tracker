package com.finflow.backend.repository;

import com.finflow.backend.entity.PodMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PodMemberRepository extends JpaRepository<PodMember, UUID> {
    List<PodMember> findByPodId(UUID podId);
    List<PodMember> findByUserId(UUID userId);
    List<PodMember> findByPendingEmail(String email);
}
