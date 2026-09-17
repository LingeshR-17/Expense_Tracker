package com.finflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "pod_members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PodMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pod_id", nullable = false)
    private Pod pod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(name = "pending_email", length = 255)
    private String pendingEmail;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private java.time.LocalDateTime joinedAt;
}
