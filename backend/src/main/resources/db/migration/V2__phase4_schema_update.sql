-- V2__phase4_schema_update.sql
ALTER TABLE pods ADD COLUMN version BIGINT DEFAULT 0;

-- PodMember update for pending email
ALTER TABLE pod_members ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE pod_members ADD COLUMN pending_email VARCHAR(255);
ALTER TABLE pod_members ADD COLUMN joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- PodExpenseShare update for split type
ALTER TABLE pod_expense_shares ADD COLUMN split_type VARCHAR(10) NOT NULL DEFAULT 'EVEN';
ALTER TABLE pod_expense_shares ADD COLUMN version BIGINT DEFAULT 0;

-- Recurring rules idempotency
ALTER TABLE recurring_rules ADD COLUMN last_run_date DATE;
