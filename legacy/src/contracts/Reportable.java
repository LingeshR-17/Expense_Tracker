package contracts;


public interface Reportable {

    String REPORT_HEADER = "==== TRANSACTION REPORT ====";

    String generateReport();
}
