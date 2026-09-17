import contracts.Reportable;
import features.Java21FeaturesDemo;
import entities.Expense;
import entities.Income;
import entities.Transaction;
import entities.TransactionBook;
import util.Category;

import java.util.Comparator;
import java.util.Scanner;
import java.util.function.Predicate;


 
public class Main {

    private static final TransactionBook book = new TransactionBook();
    private static final Scanner sc = new Scanner(System.in);

    public static void main(String[] args) throws InterruptedException {
        boolean running = true;

        while (running) {
            printMenu();
            int choice = readInt("Enter your choice: ");

            switch (choice) {
                case 1 -> addIncome();
                case 2 -> addExpense();
                case 3 -> viewAllTransactions();
                case 4 -> viewByCategory();
                case 5 -> viewSummary();
                case 6 -> sortByAmountDescending();      // anonymous class demo
                case 7 -> printReceipt();                 // Strings demo
                case 8 -> cloneLastTransaction();          // Object cloning demo
                case 9 -> classifyTransactions();          // Java 21 pattern matching for switch
                case 10 -> monthlySummaryDemo();           // Java 21 record patterns
                case 11 -> runBudgetAlert();                // Java 21 virtual threads
                case 12 -> takeBalanceSnapshot();           // inner class demo
                case 13 -> {
                    System.out.println("Goodbye! Transactions recorded this session: "
                            + Transaction.getTotalTransactionsCreated());
                    running = false;
                }
                default -> System.out.println("Invalid choice, please try again.\n");
            }
        }
        sc.close();
    }

    private static void printMenu() {
        System.out.println("===================================");
        System.out.println("     EXPENSE TRACKER SYSTEM");
        System.out.println("===================================");
        System.out.println("1.  Add Income");
        System.out.println("2.  Add Expense");
        System.out.println("3.  View All Transactions");
        System.out.println("4.  View Transactions by Category");
        System.out.println("5.  View Summary (Income / Expense / Balance)");
        System.out.println("6.  View Transactions Sorted by Amount (desc)");
        System.out.println("7.  Print Receipt for a Transaction");
        System.out.println("8.  Clone Last Transaction (repeat a recurring one)");
        System.out.println("9.  Classify Transactions (Java 21 pattern matching)");
        System.out.println("10. Monthly Summary Demo (Java 21 record patterns)");
        System.out.println("11. Run Budget Alert Check (Java 21 virtual threads)");
        System.out.println("12. Take Balance Snapshot (inner class demo)");
        System.out.println("13. Exit");
    }


    private static void addIncome() {
        double amount = readDouble("Enter amount: ");
        Category category = readCategory();
        System.out.print("Enter description: ");
        String description = sc.nextLine();
        System.out.print("Enter source (e.g. Salary, Freelance): ");
        String source = sc.nextLine();

        Income income = new Income(amount, category, description, source);
        book.add(income);
        System.out.println("Income added -> " + income + "\n");
    }

    private static void addExpense() {
        double amount = readDouble("Enter amount: ");
        Category category = readCategory();
        System.out.print("Enter description: ");
        String description = sc.nextLine();
        System.out.print("Enter payment mode (CASH/CARD/UPI): ");
        String paymentMode = sc.nextLine();

        Expense expense = new Expense(amount, category, description, paymentMode);
        book.add(expense);
        System.out.println("Expense added -> " + expense + "\n");
    }

    private static void viewAllTransactions() {
        Transaction[] all = book.getAll();
        if (all.length == 0) {
            System.out.println("No transactions recorded yet.\n");
            return;
        }
        System.out.println(Reportable.REPORT_HEADER);
        for (Transaction t : all) {
            System.out.println(t.generateDetailedReport());
        }
        System.out.println();
    }

    private static void viewByCategory() {
        if (book.size() == 0) {
            System.out.println("No transactions recorded yet.\n");
            return;
        }
        Category target = readCategory();
        Predicate<Transaction> matchesCategory = t -> t.getCategory() == target;

        Transaction[] matches = book.filter(matchesCategory);
        System.out.println("--- Transactions in category: " + target + " ---");
        if (matches.length == 0) {
            System.out.println("No transactions found in this category.");
        }
        for (Transaction t : matches) {
            System.out.println(t);
        }
        System.out.println();
    }

    private static void viewSummary() {
        if (book.size() == 0) {
            System.out.println("No transactions recorded yet.\n");
            return;
        }
        double totalIncome = 0, totalExpense = 0;
        for (Transaction t : book.getAll()) {
            if (t instanceof Income) totalIncome += t.getAmount();
            else if (t instanceof Expense) totalExpense += t.getAmount();
        }
        System.out.println("--- Summary ---");
        System.out.printf("Total Income  : Rs.%.2f%n", totalIncome);
        System.out.printf("Total Expense : Rs.%.2f%n", totalExpense);
        System.out.printf("Balance       : Rs.%.2f%n%n", book.computeBalance());
    }

   
    private static void sortByAmountDescending() {
        Transaction[] all = book.getAll();
        if (all.length == 0) {
            System.out.println("No transactions recorded yet.\n");
            return;
        }

        java.util.Arrays.sort(all, new Comparator<Transaction>() {
            @Override
            public int compare(Transaction a, Transaction b) {
                return Double.compare(b.getAmount(), a.getAmount());
            }
        });

        System.out.println("--- Transactions sorted by amount (highest first) ---");
        for (Transaction t : all) {
            System.out.println(t);
        }
        System.out.println();
    }

    private static void printReceipt() {
        Transaction[] all = book.getAll();
        if (all.length == 0) {
            System.out.println("No transactions recorded yet.\n");
            return;
        }
        int id = readInt("Enter transaction ID to print a receipt for: ");

        Transaction found = null;
        for (Transaction t : all) {
            if (t.getId() == id) {
                found = t;
                break;
            }
        }
        if (found == null) {
            System.out.println("No transaction with that ID.\n");
            return;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("*".repeat(36)).append("\n");
        sb.append(String.format("%-15s: %d%n", "Transaction ID", found.getId()));
        sb.append(String.format("%-15s: %s%n", "Type", found.getTypeLabel().toUpperCase()));
        sb.append(String.format("%-15s: Rs.%.2f%n", "Amount", found.getAmount()));
        sb.append(String.format("%-15s: %s%n", "Category", found.getCategory()));
        sb.append(String.format("%-15s: %s%n", "Description", found.getDescription().trim()));
        sb.append(String.format("%-15s: %s%n", "Date", found.getFormattedDate()));
        sb.append("*".repeat(36));

        System.out.println(sb);
        System.out.println();
    }

    private static void cloneLastTransaction() {
        Transaction[] all = book.getAll();
        if (all.length == 0) {
            System.out.println("No transactions to clone yet.\n");
            return;
        }
        Transaction last = all[all.length - 1];
        Transaction copy = last.clone(); // shallow copy via Object.clone()
        book.add(copy);
        System.out.println("Cloned transaction #" + last.getId()
                + " -> new entry: " + copy + "\n");
    }

    private static void classifyTransactions() {
        Transaction[] all = book.getAll();
        if (all.length == 0) {
            System.out.println("No transactions recorded yet.\n");
            return;
        }
        System.out.println("--- Classification (Java 21 pattern matching switch) ---");
        for (Transaction t : all) {
            System.out.println("#" + t.getId() + " -> " + Java21FeaturesDemo.classify(t));
        }
        System.out.println();
    }

    private static void monthlySummaryDemo() {
        double income = readDouble("Enter this month's total income: ");
        double expense = readDouble("Enter this month's total expense: ");
        var summary = new Java21FeaturesDemo.MonthlySummary("This Month", income, expense);
        System.out.println(Java21FeaturesDemo.describe(summary) + "\n");
    }

    private static void runBudgetAlert() throws InterruptedException {
        Java21FeaturesDemo.runBudgetAlertCheck(book.computeBalance());
        System.out.println();
    }

    private static void takeBalanceSnapshot() {
        TransactionBook.BalanceSnapshot snapshot = book.takeSnapshot();
        System.out.println(snapshot.describe() + "\n");
    }


    private static int readInt(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = sc.nextLine();
            try {
                return Integer.parseInt(input.trim());
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid whole number.");
            }
        }
    }

    private static double readDouble(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = sc.nextLine();
            try {
                double value = Double.parseDouble(input.trim());
                if (value <= 0) {
                    System.out.println("Amount must be greater than zero.");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number.");
            }
        }
    }

    private static Category readCategory() {
        Category[] values = Category.values();
        while (true) {
            System.out.println("Choose category:");
            for (int i = 0; i < values.length; i++) {
                System.out.println((i + 1) + ". " + values[i]);
            }
            int choice = readInt("Enter category number: ");
            if (choice >= 1 && choice <= values.length) {
                return values[choice - 1];
            }
            System.out.println("Invalid category choice, try again.");
        }
    }
}
