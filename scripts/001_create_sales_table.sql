-- Create sales table for tracking transactions
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);

-- Create index for item name queries (for top sellers)
CREATE INDEX IF NOT EXISTS idx_sales_item_name ON sales(item_name);

-- Disable RLS for simple public access (no auth required per PRD)
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
