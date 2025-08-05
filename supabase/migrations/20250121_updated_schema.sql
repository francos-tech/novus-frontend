-- =============================================
-- NOVUS PLATAFORM - COMPLETE DATABASE SCHEMA
-- MVP Version with RLS DISABLED
-- =============================================

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS api_logs CASCADE;
DROP TABLE IF EXISTS insurer_tokens CASCADE;
DROP TABLE IF EXISTS quote_items CASCADE;
DROP TABLE IF EXISTS public_submissions CASCADE;
DROP TABLE IF EXISTS drafts CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS quote_templates CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS quote_status CASCADE;
DROP TYPE IF EXISTS policy_type CASCADE;
DROP TYPE IF EXISTS submission_destination CASCADE;
DROP TYPE IF EXISTS submission_type CASCADE;

-- =============================================
-- CUSTOM TYPES
-- =============================================

CREATE TYPE quote_status AS ENUM (
  'new',
  'pending', 
  'under_review',
  'quoted',
  'negotiating',
  'approved',
  'bound',
  'cancelled',
  'rejected'
);

CREATE TYPE policy_type AS ENUM (
  'general_liability',
  'professional_liability', 
  'commercial_property',
  'workers_compensation',
  'cyber_liability',
  'other'
);

CREATE TYPE submission_type AS ENUM (
  'internal',
  'public',
  'api',
  'email'
);

CREATE TYPE submission_destination AS ENUM (
  'giovana',
  'valquiria', 
  'caixa_geral'
);

-- =============================================
-- QUOTE TEMPLATES
-- =============================================

CREATE TABLE quote_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  schema JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MAIN QUOTES TABLE
-- =============================================

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES quote_templates(id),
  
  -- Basic Info
  quote_number TEXT UNIQUE, -- e.g., Q-2025-001
  company_name TEXT NOT NULL,
  applicant_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Policy Details
  policy_type policy_type NOT NULL DEFAULT 'general_liability',
  classification_code TEXT,
  classification TEXT,
  exposure_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Address Information
  address TEXT,
  address_street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  address_zip TEXT,
  country TEXT DEFAULT 'USA',
  
  -- Coverage Limits (JSON)
  coverage_limits JSONB DEFAULT '{}',
  
  -- Business Information
  years_in_business INTEGER,
  annual_revenue DECIMAL(15,2),
  number_of_employees INTEGER,
  business_description TEXT,
  
  -- Workflow
  status quote_status DEFAULT 'new',
  priority TEXT DEFAULT 'Medium Priority',
  destination submission_destination,
  submission_type submission_type DEFAULT 'internal',
  
  -- Display Fields for Kanban
  description TEXT,
  broker TEXT DEFAULT 'System Generated',
  value_display TEXT, -- Formatted value like "$1,000,000"
  updated_display TEXT DEFAULT 'just now',
  
  -- Metadata
  created_by TEXT, -- For MVP, just store name/email
  assigned_to TEXT,
  submission_source TEXT, -- 'internal_form', 'public_form', 'api', etc.
  
  -- Raw Form Data (for complete form information)
  form_data JSONB DEFAULT '{}',
  requester_info JSONB DEFAULT '{}', -- For public submissions
  
  -- Additional Info
  additional_info TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- =============================================
-- PUBLIC SUBMISSIONS (for contractor forms)
-- =============================================

CREATE TABLE public_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Requester Information
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_company TEXT,
  requester_phone TEXT,
  
  -- Application Data
  form_data JSONB NOT NULL DEFAULT '{}',
  
  -- Processing Status
  status TEXT DEFAULT 'submitted', -- submitted, reviewed, converted, rejected
  converted_to_quote_id UUID REFERENCES quotes(id),
  
  -- Metadata
  submission_type submission_type DEFAULT 'public',
  ip_address TEXT,
  user_agent TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- =============================================
-- QUOTE ITEMS (Insurer Responses)
-- =============================================

CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  
  -- Insurer Info
  insurer TEXT NOT NULL,
  channel TEXT CHECK (channel IN ('api', 'email')) NOT NULL,
  
  -- Quote Details
  premium DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  
  -- Raw Response Data
  payload JSONB DEFAULT '{}',
  
  -- API Response Info
  submission_id TEXT, -- External insurer submission ID
  response_status TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DRAFTS (Auto-save functionality)
-- =============================================

CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Draft Type
  draft_type TEXT DEFAULT 'quote', -- 'quote', 'public_submission'
  
  -- Saved Data
  form_data JSONB DEFAULT '{}',
  
  -- Metadata
  created_by TEXT, -- User identifier
  session_id TEXT, -- Browser session
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- =============================================
-- INSURER TOKENS (API Token Management)
-- =============================================

CREATE TABLE insurer_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insurer TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- API LOGS (API Call Tracking)
-- =============================================

CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  
  -- Request Info
  service TEXT NOT NULL, -- 'markel', 'cf', etc.
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  
  -- Request/Response Data
  request_data JSONB DEFAULT '{}',
  response_data JSONB DEFAULT '{}',
  
  -- Response Info
  status_code INTEGER,
  success BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  duration_ms INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EMAIL LOGS (Email Tracking)
-- =============================================

CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  
  -- Email Details
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  
  -- Sending Info
  service_used TEXT, -- 'sendgrid', 'ses', etc.
  status TEXT DEFAULT 'sent',
  error_message TEXT,
  
  -- Timestamps
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Quotes indexes
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);
CREATE INDEX idx_quotes_email ON quotes(email);
CREATE INDEX idx_quotes_submission_type ON quotes(submission_type);

-- Public submissions indexes
CREATE INDEX idx_public_submissions_status ON public_submissions(status);
CREATE INDEX idx_public_submissions_submitted_at ON public_submissions(submitted_at DESC);
CREATE INDEX idx_public_submissions_email ON public_submissions(requester_email);

-- Quote items indexes
CREATE INDEX idx_quote_items_quote_id ON quote_items(quote_id);
CREATE INDEX idx_quote_items_insurer ON quote_items(insurer);

-- Drafts indexes
CREATE INDEX idx_drafts_created_by ON drafts(created_by);
CREATE INDEX idx_drafts_session_id ON drafts(session_id);
CREATE INDEX idx_drafts_expires_at ON drafts(expires_at);

-- API logs indexes
CREATE INDEX idx_api_logs_quote_id ON api_logs(quote_id);
CREATE INDEX idx_api_logs_service ON api_logs(service);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_quotes_updated_at 
  BEFORE UPDATE ON quotes
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quote_items_updated_at 
  BEFORE UPDATE ON quote_items
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at 
  BEFORE UPDATE ON drafts
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurer_tokens_updated_at 
  BEFORE UPDATE ON insurer_tokens
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- GENERATE QUOTE NUMBERS
-- =============================================

CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    new_quote_number TEXT;
BEGIN
    -- Get current year
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(
        CASE 
            WHEN quote_number ~ ('^Q-' || year_part || '-[0-9]+$')
            THEN CAST(SPLIT_PART(quote_number, '-', 3) AS INTEGER)
            ELSE 0
        END
    ), 0) + 1
    INTO sequence_num
    FROM quotes
    WHERE quote_number LIKE ('Q-' || year_part || '-%');
    
    -- Generate new quote number
    new_quote_number := 'Q-' || year_part || '-' || LPAD(sequence_num::TEXT, 3, '0');
    
    -- Assign to NEW record
    NEW.quote_number := new_quote_number;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_quote_number_trigger
  BEFORE INSERT ON quotes
  FOR EACH ROW
  WHEN (NEW.quote_number IS NULL)
  EXECUTE FUNCTION generate_quote_number();

-- =============================================
-- DEFAULT QUOTE TEMPLATES
-- =============================================

INSERT INTO quote_templates (slug, name, description, schema) VALUES
('general-liability', 'General Liability', 'Standard general liability insurance quote for contractors', '{}'),
('professional-liability', 'Professional Liability', 'Professional liability and E&O coverage', '{}'),
('commercial-property', 'Commercial Property', 'Commercial property insurance coverage', '{}'),
('workers-compensation', 'Workers Compensation', 'Workers compensation insurance', '{}'),
('cyber-liability', 'Cyber Liability', 'Cyber security and data breach coverage', '{}');

-- =============================================
-- RLS DISABLED FOR MVP
-- =============================================

-- Explicitly disable RLS on all tables for MVP
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE drafts DISABLE ROW LEVEL SECURITY;
ALTER TABLE insurer_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE quote_templates DISABLE ROW LEVEL SECURITY;

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert a sample quote for testing
INSERT INTO quotes (
  company_name,
  applicant_name,
  email,
  phone,
  policy_type,
  classification,
  exposure_value,
  start_date,
  end_date,
  address_street,
  city,
  state,
  zip,
  status,
  description,
  value_display,
  submission_source,
  created_by
) VALUES (
  'ABC Construction Co.',
  'ABC Construction Co.',
  'info@abcconstruction.com',
  '(555) 123-4567',
  'general_liability',
  'General Construction',
  1000000.00,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '1 year',
  '123 Main Street',
  'San Francisco',
  'CA',
  '94105',
  'pending',
  'General Liability Insurance for ABC Construction Co.',
  '$1,000,000',
  'sample_data',
  'system'
);

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Function to clean up expired drafts
CREATE OR REPLACE FUNCTION cleanup_expired_drafts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM drafts WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ language 'plpgsql';

-- Function to convert public submission to quote
CREATE OR REPLACE FUNCTION convert_submission_to_quote(submission_id UUID)
RETURNS UUID AS $$
DECLARE
    submission_record public_submissions%ROWTYPE;
    new_quote_id UUID;
    form_data JSONB;
BEGIN
    -- Get the submission
    SELECT * INTO submission_record FROM public_submissions WHERE id = submission_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Submission not found: %', submission_id;
    END IF;
    
    -- Extract form data
    form_data := submission_record.form_data;
    
    -- Create new quote
    INSERT INTO quotes (
        company_name,
        applicant_name,
        email,
        phone,
        policy_type,
        classification,
        exposure_value,
        start_date,
        end_date,
        address_street,
        city,
        state,
        zip,
        status,
        description,
        value_display,
        submission_source,
        submission_type,
        form_data,
        requester_info,
        created_by
    ) VALUES (
        COALESCE(form_data->>'applicant_name', submission_record.requester_company, 'Unknown Company'),
        form_data->>'applicant_name',
        COALESCE(form_data->>'email', submission_record.requester_email),
        COALESCE(form_data->>'phone', form_data->>'business_phone', submission_record.requester_phone),
        'general_liability',
        COALESCE(form_data->>'classification', 'General Construction'),
        COALESCE((form_data->>'exposure_value')::DECIMAL, (form_data->>'annual_revenue')::DECIMAL, 1000000.00),
        COALESCE((form_data->>'policy_start_date')::DATE, CURRENT_DATE),
        COALESCE((form_data->>'policy_end_date')::DATE, CURRENT_DATE + INTERVAL '1 year'),
        form_data->>'address',
        form_data->>'city',
        form_data->>'state',
        form_data->>'zip',
        'pending',
        'General Liability Insurance for ' || COALESCE(form_data->>'applicant_name', submission_record.requester_company),
        '$' || COALESCE((form_data->>'exposure_value')::DECIMAL, (form_data->>'annual_revenue')::DECIMAL, 1000000.00),
        'public_form',
        'public',
        form_data,
        jsonb_build_object(
            'name', submission_record.requester_name,
            'email', submission_record.requester_email,
            'company', submission_record.requester_company,
            'phone', submission_record.requester_phone
        ),
        submission_record.requester_email
    ) RETURNING id INTO new_quote_id;
    
    -- Update submission status
    UPDATE public_submissions 
    SET 
        status = 'converted',
        converted_to_quote_id = new_quote_id,
        converted_at = NOW()
    WHERE id = submission_id;
    
    RETURN new_quote_id;
END;
$$ language 'plpgsql';

-- =============================================
-- SCHEMA COMPLETE
-- =============================================

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'NOVUS PLATAFORM DATABASE SCHEMA CREATED';
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '- quotes (main quotes table)';
    RAISE NOTICE '- public_submissions (public form submissions)';
    RAISE NOTICE '- quote_items (insurer responses)';
    RAISE NOTICE '- drafts (auto-save functionality)';
    RAISE NOTICE '- insurer_tokens (API token management)';
    RAISE NOTICE '- api_logs (API call tracking)';
    RAISE NOTICE '- email_logs (email tracking)';
    RAISE NOTICE '- quote_templates (quote templates)';
    RAISE NOTICE '';
    RAISE NOTICE 'Features:';
    RAISE NOTICE '- Auto-generated quote numbers (Q-2025-001)';
    RAISE NOTICE '- Public submission to quote conversion';
    RAISE NOTICE '- Complete form data storage';
    RAISE NOTICE '- RLS DISABLED for MVP';
    RAISE NOTICE '- Performance indexes created';
    RAISE NOTICE '- Sample data inserted';
    RAISE NOTICE '===========================================';
END $$; 