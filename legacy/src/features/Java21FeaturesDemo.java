package features;

import entities.Expense;
import entities.Income;
import entities.Transaction;


public class Java21FeaturesDemo {

  
    public record MonthlySummary(String month, double income, double expense) {
    }

    public static String classify(Transaction t) {
        return switch (t) {
            case Income i when i.getAmount() > 50000 -> "High-value income (" + i.getSource() + ")";
            case Income i -> "Regular income (" + i.getSource() + ")";
            case Expense e when e.getAmount() > 10000 -> "Major expense (" + e.getPaymentMode() + ")";
            case Expense e -> "Regular expense (" + e.getPaymentMode() + ")";
            default -> "Unknown transaction type";
        };
    }

    
    public static String describe(MonthlySummary summary) {
        return switch (summary) {
            case MonthlySummary(String month, double inc, double exp) when inc > exp ->
                    month + ": savings positive, you saved Rs." + (inc - exp);
            case MonthlySummary(String month, double inc, double exp) ->
                    month + ": overspending by Rs." + (exp - inc);
        };
    }

    
    public static void runBudgetAlertCheck(double balance) throws InterruptedException {
        Thread virtualThread = Thread.ofVirtual().name("budget-alert-check").start(() -> {
            if (balance < 0) {
                System.out.println("[Alert] Balance is negative! Running on: " + Thread.currentThread());
            } else {
                System.out.println("[Alert] Balance looks healthy. Running on: " + Thread.currentThread());
            }
        });
        virtualThread.join();    }
}
