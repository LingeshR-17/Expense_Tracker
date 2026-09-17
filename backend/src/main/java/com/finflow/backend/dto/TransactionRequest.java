package com.finflow.backend.dto;

import com.finflow.backend.entity.Transaction.TransactionType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class TransactionRequest {
    @NotNull
    private UUID categoryId;
    
    @NotNull
    private BigDecimal amount;
    
    @NotNull
    private LocalDate transactionDate;
    
    private String currency;
    private String description;
    private String paymentMethod;
    
    @NotNull
    private TransactionType type;
    
    private String receiptUrl;
    
    private UUID podId;
    private java.util.Map<UUID, BigDecimal> splits;
    private String splitType;
}
