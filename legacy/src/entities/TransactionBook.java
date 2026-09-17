package entities;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.function.Predicate;

public class TransactionBook {

    private Transaction[] transactions = new Transaction[10];
    private int count = 0;

    public void add(Transaction t) {
        if (count == transactions.length) {
            transactions = Arrays.copyOf(transactions, transactions.length * 2);
        }
        transactions[count++] = t;
    }

    public Transaction[] getAll() {
        return Arrays.copyOf(transactions, count);
    }

    public int size() {
        return count;
    }

    public double computeBalance() {
        double balance = 0;
        for (int i = 0; i < count; i++) {
            balance += transactions[i].getSignedAmount();
        }
        return balance;
    }

    public Transaction[] filter(Predicate<Transaction> predicate) {
        return Arrays.stream(transactions, 0, count)
                .filter(predicate)
                .toArray(Transaction[]::new);
    }

   
    public class BalanceSnapshot {
        private final double balanceAtCreation;
        private final int transactionCountAtCreation;
        private final LocalDateTime takenAt;

        public BalanceSnapshot() {
            // Reads the OUTER instance's state directly - no getter needed
            // because this is a non-static inner class.
            this.balanceAtCreation = computeBalance();
            this.transactionCountAtCreation = count;
            this.takenAt = LocalDateTime.now();
        }

        public String describe() {
            return String.format(
                    "Snapshot @ %s -> balance = Rs.%.2f across %d transaction(s)",
                    takenAt, balanceAtCreation, transactionCountAtCreation);
        }
    }

    public BalanceSnapshot takeSnapshot() {
        return new BalanceSnapshot();
    }
}
