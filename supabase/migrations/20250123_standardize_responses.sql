-- Add new fields to quotes table to support standardized responses
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS carrier TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS quote_number TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS policy_number TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS eligibility_status TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS policy_url TEXT;

-- Add new fields to quote_items table
ALTER TABLE quote_items ADD COLUMN IF NOT EXISTS quote_number TEXT;
ALTER TABLE quote_items ADD COLUMN IF NOT EXISTS policy_number TEXT;
ALTER TABLE quote_items ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE quote_items ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- Update quote_status enum to include new statuses
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'referred';
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'declined';
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'bound';
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'issued';

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_quotes_carrier ON quotes(carrier);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);
CREATE INDEX IF NOT EXISTS idx_quotes_policy_number ON quotes(policy_number);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_number ON quote_items(quote_number);
CREATE INDEX IF NOT EXISTS idx_quote_items_policy_number ON quote_items(policy_number);
CREATE INDEX IF NOT EXISTS idx_quote_items_status ON quote_items(status);

-- Add comments for documentation
COMMENT ON COLUMN quotes.carrier IS 'Insurance carrier (e.g., CF, Markel)';
COMMENT ON COLUMN quotes.quote_number IS 'Quote number from the carrier';
COMMENT ON COLUMN quotes.policy_number IS 'Policy number when bound/issued';
COMMENT ON COLUMN quotes.eligibility_status IS 'Eligibility status from carrier';
COMMENT ON COLUMN quotes.policy_url IS 'URL to policy documents if available';

COMMENT ON COLUMN quote_items.quote_number IS 'Quote number from specific carrier';
COMMENT ON COLUMN quote_items.policy_number IS 'Policy number from specific carrier';
COMMENT ON COLUMN quote_items.status IS 'Status of this specific quote (quoted, referred, declined, etc)';
COMMENT ON COLUMN quote_items.documents IS 'Array of document metadata (type, url) from carrier';