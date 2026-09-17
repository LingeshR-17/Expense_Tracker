package com.finflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "pod_expense_shares")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PodExpenseShare {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pod_id", nullable = false)
    private Pod pod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "owed_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal owedAmount;

    @Column(nullable = false)
    @Builder.Default
    private Boolean settled = false;

    public enum SplitType {
        EVEN, CUSTOM
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "split_type", nullable = false, length = 10)
    @Builder.Default
    private SplitType splitType = SplitType.EVEN;

    @Version
    private Long version;
}
