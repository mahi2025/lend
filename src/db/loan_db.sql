CREATE TYPE user_role AS ENUM (
  'borrower',
  'admin'
);

CREATE TYPE loan_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'paid',
    'overdue'
);

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    fullname TEXT NOT NULL,
    
    email TEXT UNIQUE NOT NULL,
    
    password_hash TEXT NOT NULL,
    
    role user_role DEFAULT 'borrower',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),

    interest_rate NUMERIC(5,2) DEFAULT 10 
    CHECK (
        interest_rate >= 0
        AND interest_rate <= 100
    ),

    total_amount NUMERIC(12,2) NOT NULL,

    remaining_balance NUMERIC(12,2) NOT NULL
    CHECK (remaining_balance >= 0),

    status loan_status NOT NULL DEFAULT 'pending',

    duration_months INTEGER NOT NULL 
    CHECK (duration_months > 0),

    approved_by UUID,

    approved_at TIMESTAMP,

    due_date TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY(approved_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


CREATE TABLE repayments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    loan_id UUID NOT NULL,

    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),

    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(loan_id)
        REFERENCES loans(id)
        ON DELETE CASCADE

);

-- Indexes
CREATE INDEX idx_loans_user_id ON loans(user_id);

CREATE INDEX idx_loans_status ON loans(status);

CREATE INDEX idx_loans_created_at ON loans(created_at);

CREATE INDEX idx_repayments_loan_id ON repayments(loan_id);


-- updated_at Trigger Function

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$

BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;

$$ LANGUAGE plpgsql;

-- Triggers

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_loans_timestamp
BEFORE UPDATE ON loans
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();