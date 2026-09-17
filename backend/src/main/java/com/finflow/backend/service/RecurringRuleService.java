package com.finflow.backend.service;

import com.finflow.backend.entity.RecurringRule;
import com.finflow.backend.entity.Transaction;
import com.finflow.backend.repository.RecurringRuleRepository;
import com.finflow.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecurringRuleService {

    private final RecurringRuleRepository recurringRuleRepository;
    private final TransactionRepository transactionRepository;

    @Scheduled(cron = "0 0 0 * * ?") // Run every day at midnight
    @Transactional
    public void processScheduledRules() {
        processRulesUpTo(LocalDate.now());
    }

    @Transactional
    public void processLoginCatchup(UUID userId) {
        // Find user's rules that are overdue. 
        // For simplicity, we can just process all overdue rules, or we can filter by user.
        // Let's just process any rule up to today. 
        // In a real app, maybe we filter by user to avoid processing everyone else's.
        processRulesUpTo(LocalDate.now());
    }

    private void processRulesUpTo(LocalDate date) {
        List<RecurringRule> dueRules = recurringRuleRepository.findByNextDueDateBefore(date.plusDays(1));

        for (RecurringRule rule : dueRules) {
            // Idempotency check: don't run if already run today
            if (rule.getLastRunDate() != null && rule.getLastRunDate().isEqual(date)) {
                continue;
            }

            Transaction templateTx = rule.getTransaction();
            
            Transaction newTx = Transaction.builder()
                    .user(templateTx.getUser())
                    .category(templateTx.getCategory())
                    .amount(templateTx.getAmount())
                    .currency(templateTx.getCurrency())
                    .transactionDate(rule.getNextDueDate())
                    .description(templateTx.getDescription() + " (Auto-generated)")
                    .paymentMethod(templateTx.getPaymentMethod())
                    .type(templateTx.getType())
                    .build();

            transactionRepository.save(newTx);

            rule.setLastRunDate(date);
            
            // Advance next due date
            switch (rule.getFrequency()) {
                case WEEKLY -> rule.setNextDueDate(rule.getNextDueDate().plusWeeks(1));
                case MONTHLY -> rule.setNextDueDate(rule.getNextDueDate().plusMonths(1));
                case YEARLY -> rule.setNextDueDate(rule.getNextDueDate().plusYears(1));
            }
            recurringRuleRepository.save(rule);
        }
    }

    @Transactional(readOnly = true)
    public List<RecurringRule> getUserRules(UUID userId) {
        return recurringRuleRepository.findByUserId(userId);
    }

    @Transactional
    public RecurringRule createRule(UUID userId, UUID transactionId, RecurringRule.Frequency frequency, LocalDate nextDueDate) {
        Transaction tx = transactionRepository.findById(transactionId).orElseThrow();
        if (!tx.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
        RecurringRule rule = RecurringRule.builder()
                .transaction(tx)
                .frequency(frequency)
                .nextDueDate(nextDueDate)
                .build();
        return recurringRuleRepository.save(rule);
    }

    @Transactional
    public void deleteRule(UUID userId, UUID ruleId) {
        RecurringRule rule = recurringRuleRepository.findById(ruleId).orElseThrow();
        if (!rule.getTransaction().getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
        recurringRuleRepository.delete(rule);
    }
}
