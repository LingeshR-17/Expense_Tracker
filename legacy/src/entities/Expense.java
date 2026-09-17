package entities;
import util.Category;


public final class Expense extends Transaction {

    private final String paymentMode; 
    public Expense(double amount, Category category, String description, String paymentMode) {
        super(amount, category, description);
        this.paymentMode = paymentMode;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    @Override
    public double getSignedAmount() {
        return -amount; 
    }

    @Override
    public String getTypeLabel() {
        return "EXPENSE";
    }

    @Override
    public String generateDetailedReport() {
        return super.generateDetailedReport() + " | Paid via: " + paymentMode;
    }
}
