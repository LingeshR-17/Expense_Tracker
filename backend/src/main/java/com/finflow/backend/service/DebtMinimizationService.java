package com.finflow.backend.service;

import com.finflow.backend.dto.SettlementTransaction;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class DebtMinimizationService {

    public List<SettlementTransaction> minimizeDebt(Map<UUID, BigDecimal> netBalances) {
        List<SettlementTransaction> settlements = new ArrayList<>();
        
        // Remove 0 balances and sort
        List<Map.Entry<UUID, BigDecimal>> debtors = new ArrayList<>();
        List<Map.Entry<UUID, BigDecimal>> creditors = new ArrayList<>();

        for (Map.Entry<UUID, BigDecimal> entry : netBalances.entrySet()) {
            BigDecimal balance = entry.getValue().setScale(2, RoundingMode.HALF_UP);
            if (balance.compareTo(BigDecimal.ZERO) < 0) {
                debtors.add(new AbstractMap.SimpleEntry<>(entry.getKey(), balance.abs()));
            } else if (balance.compareTo(BigDecimal.ZERO) > 0) {
                creditors.add(new AbstractMap.SimpleEntry<>(entry.getKey(), balance));
            }
        }

        // Sort descending to settle largest debts first
        debtors.sort((a, b) -> b.getValue().compareTo(a.getValue()));
        creditors.sort((a, b) -> b.getValue().compareTo(a.getValue()));

        int i = 0; // index for debtors
        int j = 0; // index for creditors

        while (i < debtors.size() && j < creditors.size()) {
            Map.Entry<UUID, BigDecimal> debtor = debtors.get(i);
            Map.Entry<UUID, BigDecimal> creditor = creditors.get(j);

            BigDecimal debtAmount = debtor.getValue();
            BigDecimal creditAmount = creditor.getValue();

            BigDecimal minAmount = debtAmount.min(creditAmount);

            settlements.add(new SettlementTransaction(
                    debtor.getKey(),
                    creditor.getKey(),
                    minAmount
            ));

            // Update remaining balances
            debtor.setValue(debtAmount.subtract(minAmount));
            creditor.setValue(creditAmount.subtract(minAmount));

            if (debtor.getValue().compareTo(BigDecimal.ZERO) == 0) {
                i++;
            }
            if (creditor.getValue().compareTo(BigDecimal.ZERO) == 0) {
                j++;
            }
        }

        return settlements;
    }
}
