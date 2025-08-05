export type QuoteStatus = 'new' | 'pending' | 'under_review' | 'quoted' | 'negotiating' | 'bound' | 'issued' | 'cancelled'

// Contractor Form Data Interface
export interface ContractorFormData {
  // Applicant Information
  applicant_name: string
  location_address: string
  mailing_address_line1: string
  mailing_address_line2: string
  time_in_business: string
  years_experience: string
  licensed_yes: boolean
  licensed_no: boolean
  license_year: string
  license_number: string
  license_kind: string
  other_state_yes: boolean
  other_state_no: boolean
  other_states_list: string
  
  // Operations
  pct_general_contractor: string
  pct_developer: string
  pct_subcontractor: string
  pct_penalty_clause: string
  pct_construction_manager: string
  other_ops_yes: boolean
  other_ops_no: boolean
  other_ops_cov_yes: boolean
  other_ops_cov_no: boolean
  other_ops_explain: string
  supervision_yes: boolean
  supervision_no: boolean
  supervision_explain: string
  
  // Operations Detail
  radius_operations: string
  states_worked: string
  payroll_owners: string
  payroll_employees: string
  payroll_leased: string
  payroll_total: string
  employ_prof_yes: boolean
  employ_prof_no: boolean
  wrapup_yes: boolean
  wrapup_no: boolean
  wrapup_explain: string
  
  // Work Percentages
  commercial_new: string
  commercial_remodel: string
  residential_new: string
  residential_remodel: string
  public_works_pct: string
  other_operations_pct: string
  over_20_yes: boolean
  over_20_no: boolean
  pct_industrial: string
  pct_institutional: string
  pct_mercantile: string
  pct_office: string
  pct_apartments: string
  pct_condo_town: string
  pct_custom_homes: string
  pct_tract_homes: string
  
  // Subcontractors
  certs_all_yes: boolean
  certs_all_no: boolean
  min_gl_limits: string
  written_contracts_yes: boolean
  written_contracts_no: boolean
  hh_clause_yes: boolean
  hh_clause_no: boolean
  addl_insured_yes: boolean
  addl_insured_no: boolean
  same_subs_yes: boolean
  same_subs_no: boolean
  casual_labor_yes: boolean
  casual_labor_no: boolean
  leased_emp_yes: boolean
  leased_emp_no: boolean
  benefits_wc_yes: boolean
  benefits_wc_no: boolean
  pct_work_subbed: string
  wc_carry_yes: boolean
  wc_carry_no: boolean
  
  // Financial History
  yr5_pay: string
  yr5_receipts: string
  yr5_subs: string
  yr4_pay: string
  yr4_receipts: string
  yr4_subs: string
  yr3_pay: string
  yr3_receipts: string
  yr3_subs: string
  yr2_pay: string
  yr2_receipts: string
  yr2_subs: string
  last_pay: string
  last_receipts: string
  last_subs: string
  proj_pay: string
  proj_receipts: string
  proj_subs: string
  
  // Current Projects
  cproj1_start: string
  cproj1_end: string
  cproj1_value: string
  cproj1_desc: string
  cproj2_start: string
  cproj2_end: string
  cproj2_value: string
  cproj2_desc: string
  cproj3_start: string
  cproj3_end: string
  cproj3_value: string
  cproj3_desc: string
  
  // Past Projects
  pproj1_year: string
  pproj1_value: string
  pproj1_desc: string
  pproj2_year: string
  pproj2_value: string
  pproj2_desc: string
  pproj3_year: string
  pproj3_value: string
  pproj3_desc: string
  pproj4_year: string
  pproj4_value: string
  pproj4_desc: string
  
  // Additional Questions
  avg_completed_job_value: string
  ai_endorsements_next_year: string
  q16_yes: boolean
  q16_no: boolean
  q16_receipts: string
  q16_list: string
  q17_lease_yes: boolean
  q17_lease_no: boolean
  q17_ops_yes: boolean
  q17_ops_no: boolean
  q17_cranes_yes: boolean
  q17_cranes_no: boolean
  q17_type: string
  q17_boom_length: string
  q18_yes: boolean
  q18_no: boolean
  q18_explain: string
  q19_yes: boolean
  q19_no: boolean
  q19_explain: string
  q20_store_yes: boolean
  q20_store_no: boolean
  q20_approved_yes: boolean
  q20_approved_no: boolean
  q20_explain: string
  q21_yes: boolean
  q21_no: boolean
  q21_explain: string
  q22_yes: boolean
  q22_no: boolean
  q22_explain: string
  q23_yes: boolean
  q23_no: boolean
  q23_pct: string
  q23_max_height: string
  q23_explain: string
  q24_yes: boolean
  q24_no: boolean
  q24_pct: string
  q24_max_depth: string
  q24_explain: string
  q25_yes: boolean
  q25_no: boolean
  q25_max_slope: string
  q25_explain: string
  q26_yes: boolean
  q26_no: boolean
  q26_heat_pct: string
  q26_membrane_pct: string
  q26_explain: string
  q27_fired_yes: boolean
  q27_fired_no: boolean
  q27_replaced_yes: boolean
  q27_replaced_no: boolean
  q27_explain: string
  
  // Claims/Legal
  claims_past5_yes: boolean
  claims_past5_no: boolean
  claims_past5_explain: string
  claims_pending_yes: boolean
  claims_pending_no: boolean
  claims_pending_explain: string
  knowledge_preexist_yes: boolean
  knowledge_preexist_no: boolean
  knowledge_preexist_explain: string
  faulty_construction_yes: boolean
  faulty_construction_no: boolean
  faulty_construction_explain: string
  breach_contract_yes: boolean
  breach_contract_no: boolean
  breach_contract_explain: string
  
  // Signature
  applicant_print: string
  applicant_title: string
  applicant_sign: string
  sign_date: string
}

export interface Quote {
  classification?: string
  classification_code?: string
  location_address?: string
  zip?: string
  coverage_limits?: {
    deductible?: number | string
    per_occurrence?: number | string
    aggregate?: number | string
    products?: number | string
    personal_injury?: number | string
    rented_premises?: number | string
    medical_expense?: number | string
  }
  id?: string
  quote_number?: string
  company_name?: string
  applicant_name?: string
  email?: string
  phone?: string
  address_street?: string
  address_city?: string
  address_state?: string
  address_zip?: string
  website?: string
  business_states?: string
  years_current_mgmt?: string
  payroll_projected?: string
  receipts_projected?: string
  subcontractors_projected?: string
  pct_commercial?: string
  pct_building?: string
  exposure_value?: string
  general_aggregate?: string
  policy_start_date?: string
  policy_end_date?: string
  applicant_sign?: string
  applicant_print?: string
  applicant_title?: string
  sign_date?: string
  status?: string
  priority?: string
  premium?: number
  policy_type?: string
  form_data?: ContractorFormData
  response_data?: any
  additional_class_code?: string
  additional_exposure_value?: string
  external_id?: string
  submission_type?: string
  submission_source?: string
  broker?: string
  value_display?: string
  description?: string
  requester_info?: any
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CompareQuotesResponse {
  quotes: {
    id: string
    quote_id: string
    insurer: string
    premium: number
    currency: string
    coverage_details: any
    created_at: string
    company_name: string
    isLowest: boolean
  }[]
  lowest_premium: number
  savings: number
}