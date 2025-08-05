-- Execute this SQL directly in Supabase SQL Editor
-- Add missing fields to quotes table for API responses

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS response_data JSONB DEFAULT '{}';
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS external_id TEXT;

-- Add index for external_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_quotes_external_id ON quotes(external_id);

-- Add comment for documentation
COMMENT ON COLUMN quotes.response_data IS 'Stores API responses from insurers (success or error)';
COMMENT ON COLUMN quotes.external_id IS 'External reference ID from insurer APIs (e.g., CNFQuoteNumber)';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quotes' 
AND column_name IN ('response_data', 'external_id')
ORDER BY column_name;