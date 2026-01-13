-- Add subcategory column to financial_items table
ALTER TABLE financial_items 
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Add index for better performance when filtering by subcategory
CREATE INDEX IF NOT EXISTS idx_financial_items_subcategory ON financial_items(subcategory);
