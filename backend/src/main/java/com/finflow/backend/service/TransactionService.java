package com.finflow.backend.service;

import com.finflow.backend.dto.TransactionDto;
import com.finflow.backend.dto.TransactionRequest;
import com.finflow.backend.entity.Category;
import com.finflow.backend.entity.Transaction;
import com.finflow.backend.entity.User;
import com.finflow.backend.repository.CategoryRepository;
import com.finflow.backend.repository.TransactionRepository;
import com.finflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PodService podService;

    @Transactional(readOnly = true)
    public List<TransactionDto> getUserTransactions(UUID userId) {
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<TransactionDto> searchTransactions(
            UUID userId, String keyword, java.time.LocalDate startDate, java.time.LocalDate endDate,
            java.math.BigDecimal minAmount, java.math.BigDecimal maxAmount, UUID categoryId, org.springframework.data.domain.Pageable pageable) {
        
        org.springframework.data.jpa.domain.Specification<Transaction> spec = 
            com.finflow.backend.repository.TransactionSpecification.buildFilter(userId, keyword, startDate, endDate, minAmount, maxAmount, categoryId);
            
        return transactionRepository.findAll(spec, pageable).map(this::mapToDto);
    }

    @Transactional
    public TransactionDto createTransaction(UUID userId, TransactionRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NoSuchElementException("Category not found"));

        Transaction transaction = Transaction.builder()
                .user(user)
                .category(category)
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : user.getCurrency())
                .transactionDate(request.getTransactionDate())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod())
                .type(request.getType())
                .receiptUrl(request.getReceiptUrl())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        
        if (request.getPodId() != null && request.getSplits() != null) {
            com.finflow.backend.entity.PodExpenseShare.SplitType splitType = 
                "CUSTOM".equalsIgnoreCase(request.getSplitType()) 
                    ? com.finflow.backend.entity.PodExpenseShare.SplitType.CUSTOM 
                    : com.finflow.backend.entity.PodExpenseShare.SplitType.EVEN;
            
            podService.addTransactionToPod(request.getPodId(), savedTransaction, request.getSplits(), splitType);
        }

        return mapToDto(savedTransaction);
    }

    @Transactional
    public void deleteTransaction(UUID userId, UUID transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NoSuchElementException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot delete this transaction");
        }
        
        transactionRepository.delete(transaction);
    }

    private TransactionDto mapToDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setCategoryId(transaction.getCategory().getId());
        dto.setCategoryName(transaction.getCategory().getName());
        dto.setAmount(transaction.getAmount());
        dto.setCurrency(transaction.getCurrency());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setDescription(transaction.getDescription());
        dto.setPaymentMethod(transaction.getPaymentMethod());
        dto.setType(transaction.getType());
        dto.setReceiptUrl(transaction.getReceiptUrl());
        dto.setCreatedAt(transaction.getCreatedAt());
        return dto;
    }
}
