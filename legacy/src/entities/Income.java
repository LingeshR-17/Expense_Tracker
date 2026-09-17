package entities;
import util.Category;


public class Income extends Transaction {

    // Extra field that Expense does NOT have - shows subclasses can add
    // their own state on top of what they inherit.
    private final String source; // e.g. "Salary", "Freelance", "Gift"

    public Income(double amount, Category category, String description, String source) {
        // Must be the first line: hands the shared fields up to Transaction's constructor.
        super(amount, category, description);
        this.source = source;
    }

    public String getSource() {
        return source;
    }

    @Override
    public double getSignedAmount() {
        return amount; // income increases the balance
    }

    @Override
    public String getTypeLabel() {
        return "INCOME";
    }

    @Override
    public String generateDetailedReport() {
        // Reuse the super class's version, then extend it - classic
        // use of method overriding + super, not just replacing it outright.
        return super.generateDetailedReport() + " | Source: " + source;
    }
}
