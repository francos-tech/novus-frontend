'use client'

import React, { useState, useEffect } from 'react'

interface ContractorFormProps {
  onFormChange?: (data: any) => void
  onFormSubmit?: (data: any) => Promise<void>
  initialData?: any
}

export default function ContractorForm({ onFormChange, onFormSubmit, initialData }: ContractorFormProps) {
  const [isClient, setIsClient] = useState(false)
  
  const [formData, setFormData] = useState({
    // Applicant Information
    applicant_name: '',
    location_address: '',
    mailing_address_line1: '',
    mailing_address_line2: '',
    phone: '',
    fax: '',
    email: '',
    website: '',
    federal_tax_id: '',
    business_type: '',
    date_incorporated: '',
    time_in_business: '',
    years_experience: '',
    licensed_yes: false,
    licensed_no: false,
    license_year: '',
    license_number: '',
    license_kind: '',
    other_state_yes: false,
    other_state_no: false,
    other_states_list: '',
    
    // Operations
    pct_general_contractor: '',
    pct_developer: '',
    pct_subcontractor: '',
    pct_penalty_clause: '',
    pct_construction_manager: '',
    other_ops_yes: false,
    other_ops_no: false,
    other_ops_cov_yes: false,
    other_ops_cov_no: false,
    other_ops_explain: '',
    supervision_yes: false,
    supervision_no: false,
    supervision_explain: '',
    
    // Operations Detail
    radius_operations: '',
    states_worked: '',
    payroll_owners: '',
    payroll_employees: '',
    payroll_leased: '',
    payroll_total: '',
    employ_prof_yes: false,
    employ_prof_no: false,
    wrapup_yes: false,
    wrapup_no: false,
    wrapup_explain: '',
    
    // Work Percentages
    commercial_new: '',
    commercial_remodel: '',
    residential_new: '',
    residential_remodel: '',
    public_works_pct: '',
    other_operations_pct: '',
    over_20_yes: false,
    over_20_no: false,
    pct_industrial: '',
    pct_institutional: '',
    pct_mercantile: '',
    pct_office: '',
    pct_apartments: '',
    pct_condo_town: '',
    pct_custom_homes: '',
    pct_tract_homes: '',
    pct_remodel_struct: '',
    pct_remodel_nonstruct: '',
    pct_other1: '',
    pct_other2: '',
    other_operations_explain: '',
    
    // Subcontractors
    certs_all_yes: false,
    certs_all_no: false,
    min_gl_limits: '',
    written_contracts_yes: false,
    written_contracts_no: false,
    hh_clause_yes: false,
    hh_clause_no: false,
    addl_insured_yes: false,
    addl_insured_no: false,
    same_subs_yes: false,
    same_subs_no: false,
    casual_labor_yes: false,
    casual_labor_no: false,
    leased_emp_yes: false,
    leased_emp_no: false,
    benefits_wc_yes: false,
    benefits_wc_no: false,
    pct_work_subbed: '',
    wc_carry_yes: false,
    wc_carry_no: false,
    
    // Gross Sales / Payroll History
    yr5_pay: '',
    yr5_receipts: '',
    yr5_subs: '',
    yr4_pay: '',
    yr4_receipts: '',
    yr4_subs: '',
    yr3_pay: '',
    yr3_receipts: '',
    yr3_subs: '',
    yr2_pay: '',
    yr2_receipts: '',
    yr2_subs: '',
    last_pay: '',
    last_receipts: '',
    last_subs: '',
    proj_pay: '',
    proj_receipts: '',
    proj_subs: '',
    
    // Current Projects
    cproj1_start: '',
    cproj1_end: '',
    cproj1_value: '',
    cproj1_desc: '',
    cproj2_start: '',
    cproj2_end: '',
    cproj2_value: '',
    cproj2_desc: '',
    cproj3_start: '',
    cproj3_end: '',
    cproj3_value: '',
    cproj3_desc: '',
    
    // Past Projects
    pproj1_year: '',
    pproj1_value: '',
    pproj1_desc: '',
    pproj2_year: '',
    pproj2_value: '',
    pproj2_desc: '',
    pproj3_year: '',
    pproj3_value: '',
    pproj3_desc: '',
    pproj4_year: '',
    pproj4_value: '',
    pproj4_desc: '',
    
    // Additional Questions
    q14_na: false,
    avg_completed_job_value: '',
    ai_endorsements_next_year: '',
    q16_yes: false,
    q16_no: false,
    q16_receipts: '',
    q16_list: '',
    q17_lease_yes: false,
    q17_lease_no: false,
    q17_ops_yes: false,
    q17_ops_no: false,
    q17_cranes_yes: false,
    q17_cranes_no: false,
    q17_type: '',
    q17_boom_length: '',
    q18_yes: false,
    q18_no: false,
    q18_explain: '',
    q19_yes: false,
    q19_no: false,
    q19_explain: '',
    q20_store_yes: false,
    q20_store_no: false,
    q20_approved_yes: false,
    q20_approved_no: false,
    q20_explain: '',
    q21_yes: false,
    q21_no: false,
    q21_explain: '',
    q22_yes: false,
    q22_no: false,
    q22_explain: '',
    q23_yes: false,
    q23_no: false,
    q23_pct: '',
    q23_max_height: '',
    q23_explain: '',
    q24_yes: false,
    q24_no: false,
    q24_pct: '',
    q24_max_depth: '',
    q24_explain: '',
    q25_yes: false,
    q25_no: false,
    q25_max_slope: '',
    q25_explain: '',
    q26_yes: false,
    q26_no: false,
    q26_heat_pct: '',
    q26_membrane_pct: '',
    q26_explain: '',
    q27_fired_yes: false,
    q27_fired_no: false,
    q27_replaced_yes: false,
    q27_replaced_no: false,
    q27_explain: '',
    
    // Claims / Legal / Knowledge
    claims_past5_yes: false,
    claims_past5_no: false,
    claims_past5_explain: '',
    claims_pending_yes: false,
    claims_pending_no: false,
    claims_pending_explain: '',
    knowledge_preexist_yes: false,
    knowledge_preexist_no: false,
    knowledge_preexist_explain: '',
    faulty_construction_yes: false,
    faulty_construction_no: false,
    faulty_construction_explain: '',
    breach_contract_yes: false,
    breach_contract_no: false,
    breach_contract_explain: '',
    
    // Signature
    applicant_print: '',
    applicant_title: '',
    applicant_sign: '',
    sign_date: '',

    // Initialize with provided data
    ...initialData
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
    onFormChange?.({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [name]: checked }))
    onFormChange?.({ ...formData, [name]: checked })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onFormSubmit) {
      await onFormSubmit(formData)
    }
  }

  // Remove the client check to allow server-side rendering
  // The form will work correctly with hydration

  const formClasses = {
    container: 'bg-gray-50 text-gray-900',
    table: 'bg-white',
    th: 'bg-gray-100 text-gray-900 border-gray-300',
    td: 'text-gray-900 border-gray-300',
    input: 'text-gray-900 border-gray-500 placeholder-gray-500 bg-transparent',
    sectionTitle: 'text-gray-900',
    note: 'text-gray-600',
    accent: 'text-blue-600'
  }

  return (
    <div className={`font-sans m-8 text-base min-h-screen p-5 ${formClasses.container}`}>
      <form onSubmit={handleSubmit}>


        {/* Applicant Information */}
        <div className="relative h-6 my-6">
          <div className="absolute inset-0 border-t-2 border-gray-400"></div>
          <div className="absolute inset-0 border-t-2 border-gray-400" style={{top: '4px'}}></div>
          <div className="absolute inset-0 border-t-2 border-gray-400" style={{top: '8px'}}></div>
        </div>
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          APPLICANT INFORMATION
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '32%'}}>Applicant's Name</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '34%'}}>Location Address</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '34%'}}>Mailing Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="applicant_name" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.applicant_name}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="location_address" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  placeholder="(If different)"
                  value={formData.location_address}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="mailing_address_line1" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  placeholder="Address line 1"
                  value={formData.mailing_address_line1}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="phone" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="mailing_address_line2" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  placeholder="Address line 2 / City, State Zip"
                  value={formData.mailing_address_line2}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="email" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="relative h-6 my-6">
          <div className="absolute inset-0 border-t-2 border-gray-400"></div>
        </div>

        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '16%'}}>Time in Business (Years)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '16%'}}>Years of Experience</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '18%'}}>Licensed?</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '18%'}}>Year of License</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '16%'}}>License #</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '16%'}}>Kind of License</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="time_in_business" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.time_in_business}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="years_experience" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.years_experience}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="licensed_yes"
                      checked={formData.licensed_yes}
                      onChange={(e) => handleCheckboxChange('licensed_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="licensed_no"
                      checked={formData.licensed_no}
                      onChange={(e) => handleCheckboxChange('licensed_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="license_year" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.license_year}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="license_number" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.license_number}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="license_kind" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.license_kind}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Previous/Current License in Another State?</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={4}>If Yes, List State(s)</th>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={2}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="other_state_yes"
                      checked={formData.other_state_yes}
                      onChange={(e) => handleCheckboxChange('other_state_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="other_state_no"
                      checked={formData.other_state_no}
                      onChange={(e) => handleCheckboxChange('other_state_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={4}>
                <input 
                  type="text" 
                  name="other_states_list" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.other_states_list}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          1–4. OPERATIONS
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>General Contractor %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Developer %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Subcontractor %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>With Penalty Clause %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Construction Manager (Fee Only) %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_general_contractor" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_general_contractor}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_developer" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_developer}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_subcontractor" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_subcontractor}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_penalty_clause" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_penalty_clause}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_construction_manager" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_construction_manager}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={5}>Other Operations Owned, Operated, or Managed?</th>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={5}>
                <div className="flex flex-wrap gap-4 text-xs font-semibold mb-2">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="other_ops_yes"
                      checked={formData.other_ops_yes}
                      onChange={(e) => handleCheckboxChange('other_ops_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="other_ops_no"
                      checked={formData.other_ops_no}
                      onChange={(e) => handleCheckboxChange('other_ops_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                  <span>Coverage in place elsewhere? 
                    <label className="flex items-center gap-1 ml-2">
                      <input 
                        type="checkbox" 
                        name="other_ops_cov_yes"
                        checked={formData.other_ops_cov_yes}
                        onChange={(e) => handleCheckboxChange('other_ops_cov_yes', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 ml-2">
                      <input 
                        type="checkbox" 
                        name="other_ops_cov_no"
                        checked={formData.other_ops_cov_no}
                        onChange={(e) => handleCheckboxChange('other_ops_cov_no', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>No</span>
                    </label>
                  </span>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold mb-1">Explain</label>
                  <textarea 
                    name="other_ops_explain" 
                    className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                    value={formData.other_ops_explain}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={5}>Construction Management Work Involving Supervision of Subs Whose Contracts & Payments Are NOT Directly Under Your Control?</th>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={5}>
                <div className="flex flex-wrap gap-4 text-xs font-semibold mb-2">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="supervision_yes"
                      checked={formData.supervision_yes}
                      onChange={(e) => handleCheckboxChange('supervision_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="supervision_no"
                      checked={formData.supervision_no}
                      onChange={(e) => handleCheckboxChange('supervision_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold mb-1">Explain</label>
                  <textarea 
                    name="supervision_explain" 
                    className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                    value={formData.supervision_explain}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          5–9. OPERATIONS DETAIL
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Radius of Operations (Miles)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>States Worked In</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Payroll Owners/Officers (Supervisory)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Other Employees Payroll</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="radius_operations" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.radius_operations}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="states_worked" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.states_worked}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={2}>
                <input 
                  type="text" 
                  name="payroll_owners" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.payroll_owners}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="payroll_employees" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.payroll_employees}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Leased / Temp / Casual Labor Cost</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Total Payroll</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={3}>Employ Licensed Architects/Surveyors/Engineers/RE Agents or Brokers?</th>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="payroll_leased" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.payroll_leased}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="payroll_total" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.payroll_total}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={3}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="employ_prof_yes"
                      checked={formData.employ_prof_yes}
                      onChange={(e) => handleCheckboxChange('employ_prof_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="employ_prof_no"
                      checked={formData.employ_prof_no}
                      onChange={(e) => handleCheckboxChange('employ_prof_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={5}>Prior or Planned Jobs Under "Wrap-up" or OCP Policies?</th>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={5}>
                <div className="flex flex-wrap gap-4 text-xs font-semibold mb-2">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="wrapup_yes"
                      checked={formData.wrapup_yes}
                      onChange={(e) => handleCheckboxChange('wrapup_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="wrapup_no"
                      checked={formData.wrapup_no}
                      onChange={(e) => handleCheckboxChange('wrapup_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold mb-1">Explain</label>
                  <textarea 
                    name="wrapup_explain" 
                    className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                    value={formData.wrapup_explain}
                    onChange={handleChange}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Work Percentages Table */}
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={8}>Overall Operations – Percentage of Work (List % for each category)</th>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Commercial (Total %)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Residential (Total %)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Public Works %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Other (Explain & %)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Residential Project &gt;20 Homes/Units?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">New %</label>
                <input 
                  type="text" 
                  name="commercial_new" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.commercial_new}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">Remodel %</label>
                <input 
                  type="text" 
                  name="commercial_remodel" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.commercial_remodel}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">New %</label>
                <input 
                  type="text" 
                  name="residential_new" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.residential_new}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">Remodel %</label>
                <input 
                  type="text" 
                  name="residential_remodel" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.residential_remodel}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="public_works_pct" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.public_works_pct}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="other_operations_pct" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.other_operations_pct}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={2}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="over_20_yes"
                      checked={formData.over_20_yes}
                      onChange={(e) => handleCheckboxChange('over_20_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="over_20_no"
                      checked={formData.over_20_no}
                      onChange={(e) => handleCheckboxChange('over_20_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Industrial %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Institutional %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Mercantile %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Office %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Apartments %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Condominiums/Townhouses %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Custom Homes %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Tract Homes %</th>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_industrial" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_industrial}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_institutional" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_institutional}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_mercantile" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_mercantile}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_office" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_office}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_apartments" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_apartments}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_condo_town" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_condo_town}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_custom_homes" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_custom_homes}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_tract_homes" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_tract_homes}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Remodeling – Structural %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Remodeling – Nonstructural %</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Other: % (Explain)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Other: % (Explain)</th>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={2}>
                <input 
                  type="text" 
                  name="pct_remodel_struct" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_remodel_struct}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={2}>
                <input 
                  type="text" 
                  name="pct_remodel_nonstruct" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_remodel_nonstruct}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={2}>
                <textarea 
                  name="pct_other1" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.pct_other1}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={2}>
                <textarea 
                  name="pct_other2" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.pct_other2}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          10. SUBCONTRACTORS
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} colSpan={2}>Certificates of Insurance (GL & WC) from ALL Subcontractors?</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Minimum GL Limits Required</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Written Contracts from ALL Subs?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`} colSpan={2}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="certs_all_yes"
                      checked={formData.certs_all_yes}
                      onChange={(e) => handleCheckboxChange('certs_all_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="certs_all_no"
                      checked={formData.certs_all_no}
                      onChange={(e) => handleCheckboxChange('certs_all_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="min_gl_limits" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.min_gl_limits}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="written_contracts_yes"
                      checked={formData.written_contracts_yes}
                      onChange={(e) => handleCheckboxChange('written_contracts_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="written_contracts_no"
                      checked={formData.written_contracts_no}
                      onChange={(e) => handleCheckboxChange('written_contracts_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Hold Harmless Clause in Your Favor?</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Named as Additional Insured on All Sub Policies?</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Normally Use Same Subs?</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Use Casual Labor?</th>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="hh_clause_yes"
                      checked={formData.hh_clause_yes}
                      onChange={(e) => handleCheckboxChange('hh_clause_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="hh_clause_no"
                      checked={formData.hh_clause_no}
                      onChange={(e) => handleCheckboxChange('hh_clause_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="addl_insured_yes"
                      checked={formData.addl_insured_yes}
                      onChange={(e) => handleCheckboxChange('addl_insured_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="addl_insured_no"
                      checked={formData.addl_insured_no}
                      onChange={(e) => handleCheckboxChange('addl_insured_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="same_subs_yes"
                      checked={formData.same_subs_yes}
                      onChange={(e) => handleCheckboxChange('same_subs_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="same_subs_no"
                      checked={formData.same_subs_no}
                      onChange={(e) => handleCheckboxChange('same_subs_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="casual_labor_yes"
                      checked={formData.casual_labor_yes}
                      onChange={(e) => handleCheckboxChange('casual_labor_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="casual_labor_no"
                      checked={formData.casual_labor_no}
                      onChange={(e) => handleCheckboxChange('casual_labor_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Use Leased Employees?</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Responsible for Benefits & WC?</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>% of Work Subbed Out</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Carry Worker's Comp Insurance?</th>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="leased_emp_yes"
                      checked={formData.leased_emp_yes}
                      onChange={(e) => handleCheckboxChange('leased_emp_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="leased_emp_no"
                      checked={formData.leased_emp_no}
                      onChange={(e) => handleCheckboxChange('leased_emp_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="benefits_wc_yes"
                      checked={formData.benefits_wc_yes}
                      onChange={(e) => handleCheckboxChange('benefits_wc_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="benefits_wc_no"
                      checked={formData.benefits_wc_no}
                      onChange={(e) => handleCheckboxChange('benefits_wc_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pct_work_subbed" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pct_work_subbed}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="wc_carry_yes"
                      checked={formData.wc_carry_yes}
                      onChange={(e) => handleCheckboxChange('wc_carry_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="wc_carry_no"
                      checked={formData.wc_carry_no}
                      onChange={(e) => handleCheckboxChange('wc_carry_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          11. GROSS SALES / PAYROLL HISTORY
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Year</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Payroll ($)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Receipts ($)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Subcontractors Cost ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>5th Prior Year</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr5_pay" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr5_pay}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr5_receipts" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr5_receipts}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr5_subs" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr5_subs}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>4th Prior Year</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr4_pay" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr4_pay}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr4_receipts" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr4_receipts}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr4_subs" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr4_subs}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>3rd Prior Year</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr3_pay" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr3_pay}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr3_receipts" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr3_receipts}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr3_subs" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr3_subs}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>2nd Prior Year</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr2_pay" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr2_pay}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr2_receipts" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr2_receipts}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="yr2_subs" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.yr2_subs}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>Last Year</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="last_pay" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.last_pay}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="last_receipts" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.last_receipts}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="last_subs" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.last_subs}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>Projected Next 12 Months</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="proj_pay" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.proj_pay}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="proj_receipts" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.proj_receipts}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="proj_subs" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.proj_subs}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          12. LARGEST PROJECTS – CURRENT / PLANNED (NEXT 12 MONTHS)
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Start Date</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>End Date</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Project Value ($)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="cproj1_start" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.cproj1_start}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="cproj1_end" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.cproj1_end}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="cproj1_value" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.cproj1_value}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="cproj1_desc" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.cproj1_desc}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="cproj2_start" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.cproj2_start}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="cproj2_end" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.cproj2_end}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="cproj2_value" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.cproj2_value}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="cproj2_desc" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.cproj2_desc}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="cproj3_start" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.cproj3_start}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="cproj3_end" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.cproj3_end}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="cproj3_value" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.cproj3_value}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="cproj3_desc" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.cproj3_desc}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          13. LARGEST PROJECTS – PAST 5 YEARS
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Year Completed</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Project Value ($)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pproj1_year" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pproj1_year}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pproj1_value" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pproj1_value}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="pproj1_desc" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.pproj1_desc}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pproj2_year" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pproj2_year}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pproj2_value" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pproj2_value}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="pproj2_desc" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.pproj2_desc}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pproj3_year" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pproj3_year}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pproj3_value" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pproj3_value}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="pproj3_desc" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.pproj3_desc}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pproj4_year" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pproj4_year}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="pproj4_value" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.pproj4_value}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="pproj4_desc" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.pproj4_desc}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          14–27. ADDITIONAL OPERATIONAL QUESTIONS
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '55%'}}>Question</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '20%'}}>Response (Yes / No)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`} style={{width: '25%'}}>Details / Values</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>14. Dollar value of an average COMPLETED job (includes all materials, equipment & labor)</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q14_na"
                      checked={formData.q14_na}
                      onChange={(e) => handleCheckboxChange('q14_na', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>N/A</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="avg_completed_job_value" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.avg_completed_job_value}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>15. Number of Additional Insured endorsements needed next year</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}></td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="ai_endorsements_next_year" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.ai_endorsements_next_year}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>16. Any equipment rental to others? (Attach contract, list equipment & receipts)</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q16_yes"
                      checked={formData.q16_yes}
                      onChange={(e) => handleCheckboxChange('q16_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q16_no"
                      checked={formData.q16_no}
                      onChange={(e) => handleCheckboxChange('q16_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">Sales/Receipts</label>
                <input 
                  type="text" 
                  name="q16_receipts" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q16_receipts}
                  onChange={handleChange}
                />
                <label className="block text-xs font-semibold mb-1 mt-2">List Equipment</label>
                <textarea 
                  name="q16_list" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.q16_list}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>17. Lease mobile equipment? With operators? Use cranes? (Give type & max boom length)</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span>Lease 
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q17_lease_yes"
                        checked={formData.q17_lease_yes}
                        onChange={(e) => handleCheckboxChange('q17_lease_yes', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q17_lease_no"
                        checked={formData.q17_lease_no}
                        onChange={(e) => handleCheckboxChange('q17_lease_no', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>No</span>
                    </label>
                  </span>
                  <span>Operators 
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q17_ops_yes"
                        checked={formData.q17_ops_yes}
                        onChange={(e) => handleCheckboxChange('q17_ops_yes', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q17_ops_no"
                        checked={formData.q17_ops_no}
                        onChange={(e) => handleCheckboxChange('q17_ops_no', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>No</span>
                    </label>
                  </span>
                  <span>Cranes 
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q17_cranes_yes"
                        checked={formData.q17_cranes_yes}
                        onChange={(e) => handleCheckboxChange('q17_cranes_yes', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q17_cranes_no"
                        checked={formData.q17_cranes_no}
                        onChange={(e) => handleCheckboxChange('q17_cranes_no', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>No</span>
                    </label>
                  </span>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">Type</label>
                <input 
                  type="text" 
                  name="q17_type" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q17_type}
                  onChange={handleChange}
                />
                <label className="block text-xs font-semibold mb-1 mt-2">Max Boom Length</label>
                <input 
                  type="text" 
                  name="q17_boom_length" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q17_boom_length}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>18. Perform repairs of fire, water, or mold damage?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q18_yes"
                      checked={formData.q18_yes}
                      onChange={(e) => handleCheckboxChange('q18_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q18_no"
                      checked={formData.q18_no}
                      onChange={(e) => handleCheckboxChange('q18_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="q18_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.q18_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>19. Use explosives?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q19_yes"
                      checked={formData.q19_yes}
                      onChange={(e) => handleCheckboxChange('q19_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q19_no"
                      checked={formData.q19_no}
                      onChange={(e) => handleCheckboxChange('q19_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="q19_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.q19_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>20. Flammables stored on site? In approved containers?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span>Stored 
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q20_store_yes"
                        checked={formData.q20_store_yes}
                        onChange={(e) => handleCheckboxChange('q20_store_yes', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q20_store_no"
                        checked={formData.q20_store_no}
                        onChange={(e) => handleCheckboxChange('q20_store_no', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>No</span>
                    </label>
                  </span>
                  <span>Approved 
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q20_approved_yes"
                        checked={formData.q20_approved_yes}
                        onChange={(e) => handleCheckboxChange('q20_approved_yes', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q20_approved_no"
                        checked={formData.q20_approved_no}
                        onChange={(e) => handleCheckboxChange('q20_approved_no', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>No</span>
                    </label>
                  </span>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="q20_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.q20_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>21. Work performed for any: Refineries / Gas Stations / Chemical Plants / Airports / Railroads / Hospitals / Public Utilities?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q21_yes"
                      checked={formData.q21_yes}
                      onChange={(e) => handleCheckboxChange('q21_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q21_no"
                      checked={formData.q21_no}
                      onChange={(e) => handleCheckboxChange('q21_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="q21_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.q21_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>22. Projects involving: Caissons / Piers / Retaining Walls / Shoring / Underpinning / Other Structural Engineering?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q22_yes"
                      checked={formData.q22_yes}
                      onChange={(e) => handleCheckboxChange('q22_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q22_no"
                      checked={formData.q22_no}
                      onChange={(e) => handleCheckboxChange('q22_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="q22_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.q22_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>23. Work above two stories in height? (Provide percentage & maximum height)</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q23_yes"
                      checked={formData.q23_yes}
                      onChange={(e) => handleCheckboxChange('q23_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q23_no"
                      checked={formData.q23_no}
                      onChange={(e) => handleCheckboxChange('q23_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">Percentage</label>
                <input 
                  type="text" 
                  name="q23_pct" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q23_pct}
                  onChange={handleChange}
                />
                <label className="block text-xs font-semibold mb-1 mt-2">Max Height</label>
                <input 
                  type="text" 
                  name="q23_max_height" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q23_max_height}
                  onChange={handleChange}
                />
                <textarea 
                  name="q23_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 mt-2 ${formClasses.input}`}
                  placeholder="Explain"
                  value={formData.q23_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>24. Work performed below ground level? (Provide percentage & maximum depth)</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q24_yes"
                      checked={formData.q24_yes}
                      onChange={(e) => handleCheckboxChange('q24_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q24_no"
                      checked={formData.q24_no}
                      onChange={(e) => handleCheckboxChange('q24_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">Percentage</label>
                <input 
                  type="text" 
                  name="q24_pct" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q24_pct}
                  onChange={handleChange}
                />
                <label className="block text-xs font-semibold mb-1 mt-2">Max Depth</label>
                <input 
                  type="text" 
                  name="q24_max_depth" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q24_max_depth}
                  onChange={handleChange}
                />
                <textarea 
                  name="q24_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 mt-2 ${formClasses.input}`}
                  placeholder="Explain"
                  value={formData.q24_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>25. Work on hillsides, hilltops, slopes, or landfills? (Maximum degree of slope)</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q25_yes"
                      checked={formData.q25_yes}
                      onChange={(e) => handleCheckboxChange('q25_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q25_no"
                      checked={formData.q25_no}
                      onChange={(e) => handleCheckboxChange('q25_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">Max Degree of Slope</label>
                <input 
                  type="text" 
                  name="q25_max_slope" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q25_max_slope}
                  onChange={handleChange}
                />
                <textarea 
                  name="q25_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 mt-2 ${formClasses.input}`}
                  placeholder="Explain"
                  value={formData.q25_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>26. Repair, replace, or install new roofs? (Heat applications % / Membrane roofing %)</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q26_yes"
                      checked={formData.q26_yes}
                      onChange={(e) => handleCheckboxChange('q26_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="q26_no"
                      checked={formData.q26_no}
                      onChange={(e) => handleCheckboxChange('q26_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <label className="block text-xs font-semibold mb-1">Heat Applications %</label>
                <input 
                  type="text" 
                  name="q26_heat_pct" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q26_heat_pct}
                  onChange={handleChange}
                />
                <label className="block text-xs font-semibold mb-1 mt-2">Membrane Roofing %</label>
                <input 
                  type="text" 
                  name="q26_membrane_pct" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.q26_membrane_pct}
                  onChange={handleChange}
                />
                <textarea 
                  name="q26_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 mt-2 ${formClasses.input}`}
                  placeholder="Explain"
                  value={formData.q26_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>27. In past 3 years: been fired or replaced on a job in progress? / Replaced another contractor? (Explain)</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span>Fired/Replaced 
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q27_fired_yes"
                        checked={formData.q27_fired_yes}
                        onChange={(e) => handleCheckboxChange('q27_fired_yes', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q27_fired_no"
                        checked={formData.q27_fired_no}
                        onChange={(e) => handleCheckboxChange('q27_fired_no', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>No</span>
                    </label>
                  </span>
                  <span>Replaced Others 
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q27_replaced_yes"
                        checked={formData.q27_replaced_yes}
                        onChange={(e) => handleCheckboxChange('q27_replaced_yes', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 ml-1">
                      <input 
                        type="checkbox" 
                        name="q27_replaced_no"
                        checked={formData.q27_replaced_no}
                        onChange={(e) => handleCheckboxChange('q27_replaced_no', e.target.checked)}
                        className="transform scale-105"
                      />
                      <span>No</span>
                    </label>
                  </span>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="q27_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.q27_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          CLAIMS / LEGAL / KNOWLEDGE
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Question</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Yes / No</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Explain (If Yes)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>Were there any claims, losses, or suits against you in the past five years?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="claims_past5_yes"
                      checked={formData.claims_past5_yes}
                      onChange={(e) => handleCheckboxChange('claims_past5_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="claims_past5_no"
                      checked={formData.claims_past5_no}
                      onChange={(e) => handleCheckboxChange('claims_past5_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="claims_past5_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.claims_past5_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>Any claims or legal actions pending against any entities named in the application?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="claims_pending_yes"
                      checked={formData.claims_pending_yes}
                      onChange={(e) => handleCheckboxChange('claims_pending_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="claims_pending_no"
                      checked={formData.claims_pending_no}
                      onChange={(e) => handleCheckboxChange('claims_pending_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="claims_pending_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.claims_pending_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>Knowledge of pre-existing act/omission/event/condition/damage that may give rise to a claim?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="knowledge_preexist_yes"
                      checked={formData.knowledge_preexist_yes}
                      onChange={(e) => handleCheckboxChange('knowledge_preexist_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="knowledge_preexist_no"
                      checked={formData.knowledge_preexist_no}
                      onChange={(e) => handleCheckboxChange('knowledge_preexist_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="knowledge_preexist_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.knowledge_preexist_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>Accused of faulty construction in the past five years?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="faulty_construction_yes"
                      checked={formData.faulty_construction_yes}
                      onChange={(e) => handleCheckboxChange('faulty_construction_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="faulty_construction_no"
                      checked={formData.faulty_construction_no}
                      onChange={(e) => handleCheckboxChange('faulty_construction_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="faulty_construction_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.faulty_construction_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>Accused of breaching a contract in the past five years?</td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="breach_contract_yes"
                      checked={formData.breach_contract_yes}
                      onChange={(e) => handleCheckboxChange('breach_contract_yes', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      name="breach_contract_no"
                      checked={formData.breach_contract_no}
                      onChange={(e) => handleCheckboxChange('breach_contract_no', e.target.checked)}
                      className="transform scale-105"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <textarea 
                  name="breach_contract_explain" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit resize-vertical min-h-8 ${formClasses.input}`}
                  value={formData.breach_contract_explain}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          FAIR CREDIT REPORT ACT NOTICE
        </h3>
        
        <p className={`text-xs leading-tight mb-4 ${formClasses.note}`}>
          Personal information about you, including information from a credit or other investigative report, may be collected from persons other than you in connection with this application for insurance and subsequent amendments and renewals. Such information as well as other personal and privileged information collected by us or our agents may in certain circumstances be disclosed to third parties without your authorization. Credit scoring information may be used to help determine either your eligibility for insurance or the premium you will be charged. We may use a third party in connection with the development of your score. You have the right to review your personal information in our files and can request correction of any inaccuracies. A more detailed description of your rights and our practices regarding such information is available upon request. If you would like a copy, please write to us.
        </p>

        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          FRAUD WARNING
        </h3>
        
        <p className={`text-xs leading-tight mb-4 ${formClasses.note}`}>
          Any person who knowingly and with intent to defraud any insurance company or other person files an application for insurance or statement of claim containing any materially false information or conceals for the purpose of misleading, information concerning any fact material thereto commits a fraudulent insurance act, which is a crime and subjects such person to criminal and civil penalties. (Not applicable to CO, FL, HI, MA, NE, OH, OK, OR or VT.) In DC, LA, ME, TN and VA, insurance fraud is a crime and subject to criminal and/or civil penalties. In FL, any person who knowingly and with intent to injure, defraud or deceive any insurer files a statement of claim or an application containing any false, incomplete or misleading information is guilty of a felony of the third degree. In KS, any person who knowingly and with intent to defraud any insurance company or other person files an application for insurance or statement of claim containing any materially false information, or conceals for the purpose of misleading, information concerning any fact material thereto commits a fraudulent insurance act, which is a crime and shall also be subject to penalties. In MA, any person who knowingly and with intent to defraud any insurance company or other person files an application for insurance or statement of claim containing any materially false information or conceals for the purpose of misleading, information concerning any fact material thereto may be committing a fraudulent insurance act, which may be a crime and may subject such person to criminal and civil penalties. In OK, any person who knowingly, and with intent to injure, defraud or deceive any insurer, makes any claim for the proceeds of an insurance policy containing any false, incomplete or misleading information is guilty of a felony. In OH, any person who, with intent to defraud or knowing he is facilitating a fraud against an insurer, submits an application or files a claim containing a false or deceptive statement is guilty of insurance fraud. In OR, any person who knowingly and with intent to defraud or solicit another to defraud an insurer: (1) by submitting an application or (2) by filing a claim containing a false statement as to any material fact may be violating state law. In VT, any person who knowingly presents a false or fraudulent claim for payment of a loss or knowingly makes a false statement in an application for insurance may be guilty of a crime and may be subject to fines and confinement in prison. In CO, it is unlawful to knowingly provide false, incomplete, or misleading facts or information to an insurance company for the purpose of defrauding or attempting to defraud the company. Penalties may include imprisonment, fines, denial of insurance and civil damages. Any insurance company or agent of an insurance company who knowingly provides false, incomplete, or misleading facts or information to a policyholder or claimant for the purpose of defrauding or attempting to defraud the policyholder or claimant with regard to a settlement or award payable from insurance proceeds shall be reported to the Colorado division of insurance.
        </p>

        <hr className="border-t-2 border-gray-400 my-8" />
        
        <h3 className={`text-base mt-8 mb-2 pl-2 relative font-bold leading-tight border-l-4 border-blue-600 ${formClasses.sectionTitle}`}>
          SIGNATURE
        </h3>
        
        <table className={`w-full border-collapse mb-4 ${formClasses.table}`}>
          <thead>
            <tr>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Name of Applicant (Print)</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Title</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Signature of Applicant</th>
              <th className={`border p-1 align-top text-xs font-semibold text-left ${formClasses.th}`}>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="applicant_print" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.applicant_print}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="applicant_title" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.applicant_title}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="text" 
                  name="applicant_sign" 
                  placeholder="(Sign or e-sign here)"
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.applicant_sign}
                  onChange={handleChange}
                />
              </td>
              <td className={`border p-1 align-top text-xs ${formClasses.td}`}>
                <input 
                  type="date" 
                  name="sign_date" 
                  className={`w-full border-0 border-b bg-transparent p-0 font-inherit ${formClasses.input}`}
                  value={formData.sign_date}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <p className={`text-xs text-center mt-4 ${formClasses.note}`}>
          Web rendition of Contractor's Supplemental Application – layout approximates original PDF while enabling on-screen completion.
        </p>
        
        <div className="text-center mt-8">
          <button 
            type="submit" 
            className="px-5 py-2 bg-blue-600 text-white border-0 rounded cursor-pointer hover:bg-blue-700"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  )
} 