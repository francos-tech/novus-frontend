-- Create custom types
CREATE TYPE quote_status AS ENUM ('new','sent_api','sent_email','quoted','discarded','approved');
CREATE TYPE policy_type AS ENUM ('responsabilidade_civil', 'patrimonial', 'vida', 'saude', 'auto', 'outros');
CREATE TYPE submission_destination AS ENUM ('giovana', 'valquiria', 'caixa_geral');

-- Quote templates table
CREATE TABLE IF NOT EXISTS quote_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  schema JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES quote_templates(id),
  
  -- Company and contact info
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Policy details
  policy_type policy_type NOT NULL,
  classification TEXT NOT NULL,
  exposure_value DECIMAL(12,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Address
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_zip TEXT NOT NULL,
  address_country TEXT DEFAULT 'Brasil',
  
  -- Coverage and additional info
  coverage_limits JSONB,
  additional_info TEXT,
  
  -- Workflow
  status quote_status DEFAULT 'new',
  destination submission_destination NOT NULL,
  
  -- User relationships (auth.users)
  created_by UUID NOT NULL,
  assigned_to UUID,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Quote items/responses from insurers
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  insurer TEXT NOT NULL,
  channel TEXT CHECK (channel IN ('api', 'email')) NOT NULL,
  premium DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Token caching for insurer APIs
CREATE TABLE IF NOT EXISTS insurer_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insurer TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(insurer)
);

-- API call logging
CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  status_code INTEGER,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  error_message TEXT,
  service_used TEXT
);

-- Drafts table for auto-save functionality
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Same fields as quotes but nullable
  company_name TEXT,
  email TEXT,
  policy_type policy_type,
  classification TEXT,
  exposure_value DECIMAL(12,2),
  start_date DATE,
  end_date DATE,
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  address_country TEXT DEFAULT 'Brasil',
  coverage_limits JSONB,
  additional_info TEXT,
  destination submission_destination,
  
  -- Metadata
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_by ON quotes(created_by);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE INDEX idx_quote_items_quote_id ON quote_items(quote_id);
CREATE INDEX idx_quote_items_insurer ON quote_items(insurer);
CREATE INDEX idx_insurer_tokens_insurer ON insurer_tokens(insurer);
CREATE INDEX idx_api_logs_quote_id ON api_logs(quote_id);
CREATE INDEX idx_api_logs_service ON api_logs(service);
CREATE INDEX idx_drafts_created_by ON drafts(created_by);

-- Insert default quote templates
INSERT INTO quote_templates (slug, name, description, schema) VALUES
('general-liability', 'General Liability', 'Standard general liability insurance quote', '{}'),
('professional-liability', 'Professional Liability', 'Professional liability and E&O coverage', '{}'),
('property-insurance', 'Property Insurance', 'Commercial property insurance coverage', '{}'),
('workers-compensation', 'Workers Compensation', 'Workers compensation insurance', '{}');

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quotes_updated_at 
  BEFORE UPDATE ON quotes
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at 
  BEFORE UPDATE ON drafts
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Enable for all tables
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- For now, allow authenticated users to access all data
-- In production, you would implement more restrictive policies
CREATE POLICY "Allow authenticated users full access to quotes" ON quotes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to quote_items" ON quote_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to drafts" ON drafts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to api_logs" ON api_logs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to email_logs" ON email_logs
  FOR ALL USING (auth.role() = 'authenticated'); 