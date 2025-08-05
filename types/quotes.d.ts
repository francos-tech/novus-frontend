export type QuoteStatus = 'new' | 'sent_api' | 'sent_email' | 'quoted' | 'discarded' | 'approved'

export type PolicyType = 'responsabilidade_civil' | 'patrimonial' | 'vida' | 'saude' | 'auto' | 'outros'

export type SubmissionDestination = 'giovana' | 'valquiria' | 'caixa_geral'

export interface Quote {
  id: string
  company_name: string
  email: string
  policy_type: PolicyType
  classification: string
  exposure_value: number
  start_date: string
  end_date: string
  address_street: string
  address_city: string
  address_state: string
  address_zip: string
  address_country?: string
  coverage_limits?: {
    per_occurrence?: number
    aggregate?: number
    products?: number
    deductible?: number
    personal_injury?: number
    rented_premises?: number
    medical_expense?: number
  }
  additional_info?: string
  status: QuoteStatus
  destination: SubmissionDestination
  created_by: string
  assigned_to?: string
  created_at: string
  updated_at: string
  submitted_at?: string
  completed_at?: string
}

export interface QuoteItem {
  id: string
  quote_id: string
  insurer: string
  channel: 'api' | 'email'
  premium?: number
  currency?: string
  payload?: any
  created_at: string
}

export interface QuoteTemplate {
  id: string
  slug: string
  name: string
  description?: string
  schema?: any
  created_at: string
}

export interface InsurerToken {
  id: string
  insurer: string
  token: string
  expires_at: string
  created_at: string
}

// Markel Types
export interface MarkelAuthResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
}

export interface MarkelSubmissionRequest {
  ClientTransactionReferenceId: string
  PolicyEffectiveDate: string
  PolicyExpirationDate: string
  HomeState: string
  Insureds: {
    PrimaryNamedInsured: {
      Value: string
      Address: {
        StreetAddress: string
        City: string
        State: string
        ZipCode: string
      }
      Email: string
    }
  }
  ProducerInformation: {
    Producer: {
      Value: string
    }
  }
  GeneralLiability: {
    GlRiskUnits: Array<{
      GlClassification: {
        Value: string
      }
      Location: {
        LocationNumber: string
        Address: {
          StreetAddress: string
          City: string
          State: string
          ZipCode: string
        }
      }
      GlExposure: {
        Value: number
      }
      UnderwritingQuestions: any[]
    }>
    GlLimitsAndDeductibles: {
      PerOccurrenceLimit: { Value: number }
      GeneralAggregateLimit: { Value: number }
      ProductsAggregateLimit: { Value: string }
      Deductible: { Value: number }
      PersonalAndAdvertisingInjuryLimit: { Value: string }
      DamageToRentedPremisesLimit: { Value: string }
      MedicalExpenseLimit: { Value: string }
    }
    UnderwritingQuestions: any[]
  }
  PolicyForms: any[]
}

export interface MarkelSubmissionResponse {
  SubmissionNumber: string
  Status: string
  Premium?: number
}

// C&F Types
export interface CFQuoteRequest {
  method: 'quote' | 'bind' | 'issue'
  quoteDetails: {
    cnfPolicyService: {
      cnfPolicyHeader: {
        ServiceName: string
        AgencyReferenceID: string
        CNFQuoteNumber: string
        UserCredentials: {
          UserName: string
          Password: string
        }
      }
      cnfPolicyData: {
        data: {
          account?: {
            Name: string
            location: Array<{
              Number: string
              IsPrimaryLocation: string
              Address1: string
              ZipCode: string
            }>
          }
          policy?: {
            EffectiveDate: string
            ExpirationDate: string
            line: {
              Type: string
              Deductible: string
              PolicyPerOccurenceLimit: string
              PolicyAggregateLimit: string
              CoverageForm: string
              risk: Array<{
                LocationNumber: string
                GLClassCode: string
                Exposure: string
              }>
            }
          }
        }
      }
    }
  }
}

export interface CFQuoteResponse {
  cnfPolicyService: {
    cnfPolicyHeader: {
      CNFQuoteNumber: string
      Status: string
    }
    cnfPolicyData: {
      data: {
        policy: {
          PolicyPremium: string
          QuoteNumber: string
          line: any
        }
      }
    }
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CompareQuotesResponse {
  quotes: Array<{
    id: string
    insurer: string
    premium: number
    coverage_details?: any
    isLowest?: boolean
  }>
  lowest_premium: number
  savings?: number
} 