package entities;

import contracts.DetailedReportable;
import util.Category;

import java.time.LocalDate;
import java.util.Objects;

public abstract class Transaction implements DetailedReportable, Cloneable {

    private static int nextId = 1;

   
    protected int id;
    protected double amount;
    protected Category category;
    protected String description;
    protected LocalDate date;

    // Constructor - subclasses call this via super(...)
    protected Transaction(double amount, Category category, String description) {
        this.id = nextId++;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.date = LocalDate.now();
    }

    
    public abstract double getSignedAmount();

    public abstract String getTypeLabel();

    // ---------- Final methods: subclasses CANNOT override these ----------

    public final int getId() {
        return id;
    }

    public final String getFormattedDate() {
        return date.toString();
    }

    // ---------- Plain getters (not final, but not overridden either) ----------

    public double getAmount() {
        return amount;
    }

    public Category getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDate() {
        return date;
    }

    public static int getTotalTransactionsCreated() {
        return nextId - 1;
    }

    // ---------- Interface implementation (Reportable / DetailedReportable) ----------

    @Override
    public String generateReport() {
        return String.format("[#%d] %-8s | Rs.%-10.2f | %-13s | %-20s | %s",
                id, getTypeLabel(), amount, category, description, getFormattedDate());
    }

    @Override
    public String generateDetailedReport() {
        return generateReport() + " | Category details: " + category.name();
    }

    

    @Override
    public String toString() {
        return generateReport();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Transaction other)) return false;
        return this.id == other.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }



    @Override
    public Transaction clone() {
        try {
            return (Transaction) super.clone();
        } catch (CloneNotSupportedException e) {
            // Can't happen: we declared Cloneable above.
            throw new AssertionError("Cloneable but clone() failed", e);
        }
    }
}
