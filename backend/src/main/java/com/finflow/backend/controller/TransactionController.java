package com.finflow.backend.controller;

import com.finflow.backend.dto.TransactionDto;
import com.finflow.backend.dto.TransactionRequest;
import com.finflow.backend.security.UserPrincipal;
import com.finflow.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionDto>> getTransactions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(transactionService.getUserTransactions(userPrincipal.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<org.springframework.data.domain.Page<TransactionDto>> searchTransactions(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate endDate,
            @RequestParam(required = false) java.math.BigDecimal minAmount,
            @RequestParam(required = false) java.math.BigDecimal maxAmount,
            @RequestParam(required = false) UUID categoryId,
            org.springframework.data.domain.Pageable pageable) {
            
        return ResponseEntity.ok(transactionService.searchTransactions(userPrincipal.getId(), keyword, startDate, endDate, minAmount, maxAmount, categoryId, pageable));
    }

    @PostMapping
    public ResponseEntity<TransactionDto> createTransaction(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.createTransaction(userPrincipal.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable UUID id) {
        transactionService.deleteTransaction(userPrincipal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
