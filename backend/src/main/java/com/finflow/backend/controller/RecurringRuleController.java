package com.finflow.backend.controller;

import com.finflow.backend.entity.RecurringRule;
import com.finflow.backend.security.UserPrincipal;
import com.finflow.backend.service.RecurringRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rules")
@RequiredArgsConstructor
public class RecurringRuleController {

    private final RecurringRuleService recurringRuleService;

    @GetMapping
    public ResponseEntity<List<RecurringRule>> getUserRules(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(recurringRuleService.getUserRules(userPrincipal.getId()));
    }

    @PostMapping
    public ResponseEntity<RecurringRule> createRule(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Map<String, String> request) {
        UUID transactionId = UUID.fromString(request.get("transactionId"));
        RecurringRule.Frequency frequency = RecurringRule.Frequency.valueOf(request.get("frequency"));
        LocalDate nextDueDate = LocalDate.parse(request.get("nextDueDate"));
        
        RecurringRule rule = recurringRuleService.createRule(userPrincipal.getId(), transactionId, frequency, nextDueDate);
        return ResponseEntity.status(HttpStatus.CREATED).body(rule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable UUID id) {
        recurringRuleService.deleteRule(userPrincipal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
