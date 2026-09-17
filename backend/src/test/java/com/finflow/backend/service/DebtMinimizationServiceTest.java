package com.finflow.backend.service;

import com.finflow.backend.dto.SettlementTransaction;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DebtMinimizationServiceTest {

    private final DebtMinimizationService service = new DebtMinimizationService();

    @Test
    void testMinimizeDebt_SimpleCycle() {
        // Scenario: A owes B $10, B owes C $10, C owes A $10.
        // Net balances: A=0, B=0, C=0.
        // Expect: 0 transactions.
        Map<UUID, BigDecimal> balances = new HashMap<>();
        UUID a = UUID.randomUUID();
        UUID b = UUID.randomUUID();
        UUID c = UUID.randomUUID();
        balances.put(a, BigDecimal.ZERO);
        balances.put(b, BigDecimal.ZERO);
        balances.put(c, BigDecimal.ZERO);

        List<SettlementTransaction> settlements = service.minimizeDebt(balances);
        assertEquals(0, settlements.size());
    }

    @Test
    void testMinimizeDebt_Complex() {
        // Scenario: 
        // A paid $100 for A, B, C, D (25 each).
        // B paid $50 for A, B (25 each).
        // D paid $200 for C, D (100 each).
        // Let's compute net balances directly:
        // A: +100 (paid) - 25 (to A) - 25 (to B) = +50
        // B: +50 (paid) - 25 (to A) - 25 (to B) = 0
        // C: 0 (paid) - 25 (to A) - 100 (to D) = -125
        // D: +200 (paid) - 25 (to A) - 100 (to D) = +75
        // Total sum = 50 + 0 - 125 + 75 = 0
        
        UUID a = UUID.randomUUID();
        UUID b = UUID.randomUUID();
        UUID c = UUID.randomUUID();
        UUID d = UUID.randomUUID();

        Map<UUID, BigDecimal> balances = new HashMap<>();
        balances.put(a, new BigDecimal("50.00"));
        balances.put(b, BigDecimal.ZERO);
        balances.put(c, new BigDecimal("-125.00"));
        balances.put(d, new BigDecimal("75.00"));

        List<SettlementTransaction> settlements = service.minimizeDebt(balances);
        
        // C is the only debtor (-125). A (+50) and D (+75) are creditors.
        // Expect C to pay D 75, and C to pay A 50. Total 2 transactions.
        assertEquals(2, settlements.size());
        
        // Since we sort descending, D is the largest creditor (75).
        // C owes 125. C pays D 75 first.
        assertEquals(c, settlements.get(0).getFromUserId());
        assertEquals(d, settlements.get(0).getToUserId());
        assertEquals(0, settlements.get(0).getAmount().compareTo(new BigDecimal("75.00")));
        
        // Then C pays A 50.
        assertEquals(c, settlements.get(1).getFromUserId());
        assertEquals(a, settlements.get(1).getToUserId());
        assertEquals(0, settlements.get(1).getAmount().compareTo(new BigDecimal("50.00")));
    }
}
