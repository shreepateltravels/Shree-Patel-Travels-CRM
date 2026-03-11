-- 1. Customers Table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile_number TEXT NOT NULL UNIQUE,
  last_booking_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES FOR 'customers' TABLE
CREATE POLICY "All authenticated users can manage customers" ON customers
FOR ALL TO authenticated
USING (true);