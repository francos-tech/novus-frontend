-- Enhance api_logs table to include more details
ALTER TABLE api_logs 
  -- Add headers columns
  ADD COLUMN IF NOT EXISTS request_headers JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS response_headers JSONB DEFAULT '{}',
  
  -- Add correlation fields
  ADD COLUMN IF NOT EXISTS quote_number TEXT,
  ADD COLUMN IF NOT EXISTS policy_number TEXT,
  
  -- Add operation type for better tracking
  ADD COLUMN IF NOT EXISTS operation_type TEXT CHECK (operation_type IN ('quote', 'bind', 'issue', 'document', 'other')),
  
  -- Add carrier field to match with quotes table
  ADD COLUMN IF NOT EXISTS carrier TEXT;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_api_logs_quote_number ON api_logs(quote_number);
CREATE INDEX IF NOT EXISTS idx_api_logs_policy_number ON api_logs(policy_number);
CREATE INDEX IF NOT EXISTS idx_api_logs_operation_type ON api_logs(operation_type);
CREATE INDEX IF NOT EXISTS idx_api_logs_carrier ON api_logs(carrier);

-- Add comments for documentation
COMMENT ON COLUMN api_logs.request_headers IS 'Request headers sent to the API';
COMMENT ON COLUMN api_logs.response_headers IS 'Response headers received from the API';
COMMENT ON COLUMN api_logs.quote_number IS 'Quote number from carrier for correlation';
COMMENT ON COLUMN api_logs.policy_number IS 'Policy number from carrier for correlation';
COMMENT ON COLUMN api_logs.operation_type IS 'Type of operation (quote, bind, issue, etc)';
COMMENT ON COLUMN api_logs.carrier IS 'Insurance carrier (CF, Markel, etc)';