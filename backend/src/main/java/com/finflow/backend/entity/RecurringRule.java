package com.finflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "recurring_rules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecurringRule {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Frequency frequency;

    @Column(name = "next_due_date", nullable = false)
    private LocalDate nextDueDate;

    @Column(name = "last_run_date")
    private LocalDate lastRunDate;

    public enum Frequency {
        WEEKLY, MONTHLY, YEARLY
    }
}
