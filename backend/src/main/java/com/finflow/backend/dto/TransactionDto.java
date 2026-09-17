package com.finflow.backend.dto;

import com.finflow.backend.entity.Transaction.TransactionType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionDto {
    private UUID id;
    private UUID categoryId;
    private String categoryName;
    private BigDecimal amount;
    private String currency;
    private LocalDate transactionDate;
    private String description;
    private String paymentMethod;
    private TransactionType type;
    private String receiptUrl;
    private LocalDateTime createdAt;
}
