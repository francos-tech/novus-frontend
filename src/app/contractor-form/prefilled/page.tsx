'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Send, Save, Sun, Moon, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ContractorForm from '@/app/(internal)/quotes/new/contractor-form'

export default function PrefilledContractorFormPage() {
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requesterInfo, setRequesterInfo] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Dados pré-preenchidos baseados no PDF
  const prefilledData = {
    // Applicant Information
    applicant_name: 'Giovanna Construction',
    location_address: '1 Polaris Way , Ste 190',
    mailing_address_line1: '1 Polaris Way , Ste 190',
    mailing_address_line2: 'Aliso Viejo, CA 92656',
    phone: '',
    email: '',
    
    // Time in Business & Experience
    time_in_business: '0 (new venture)',
    years_experience: '5',
    
    // License Information
    licensed_yes: true,
    licensed_no: false,
    license_year: '',
    license_number: '',
    license_kind: '',
    
    // Previous License in Another State
    other_state_yes: false,
    other_state_no: true,
    other_states_list: '',
    
    // Operations Percentages
    pct_general_contractor: '',
    pct_developer: '',
    pct_subcontractor: '',
    pct_penalty_clause: '',
    pct_construction_manager: '',
    
    // Other Operations
    other_ops_yes: false,
    other_ops_no: true,
    other_ops_cov_yes: false,
    other_ops_cov_no: true,
    other_ops_explain: '',
    
    // Supervision
    supervision_yes: false,
    supervision_no: true,
    supervision_explain: '',
    
    // Operations Details
    radius_operations: '',
    states_worked: '',
    payroll_owners: '',
    payroll_employees: '',
    payroll_leased: '',
    payroll_total: '',
    
    // Professional Employment
    employ_prof_yes: false,
    employ_prof_no: true,
    
    // Wrap-up Policies
    wrapup_yes: false,
    wrapup_no: true,
    wrapup_explain: '',
    
    // Overall Operations Percentages
    commercial_new: '',
    commercial_remodel: '',
    residential_new: '',
    residential_remodel: '',
    public_works_pct: '',
    other_operations_pct: '',
    
    // Residential Projects >20 Homes
    over_20_yes: false,
    over_20_no: true,
    
    // Project Percentages
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
    
    // Certificates & Contracts
    certs_all_yes: false,
    certs_all_no: true,
    min_gl_limits: '',
    written_contracts_yes: false,
    written_contracts_no: true,
    hh_clause_yes: false,
    hh_clause_no: true,
    addl_insured_yes: false,
    addl_insured_no: true,
    same_subs_yes: false,
    same_subs_no: true,
    casual_labor_yes: false,
    casual_labor_no: true,
    leased_emp_yes: false,
    leased_emp_no: true,
    benefits_wc_yes: false,
    benefits_wc_no: true,
    pct_work_subbed: '',
    wc_carry_yes: false,
    wc_carry_no: true,
    
    // Financial Information
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
    q16_no: true,
    q16_receipts: '',
    q16_list: '',
    q17_lease_yes: false,
    q17_lease_no: true,
    q17_ops_yes: false,
    q17_ops_no: true,
    q17_cranes_yes: false,
    q17_cranes_no: true,
    q17_type: '',
    q17_boom_length: '',
    q18_yes: false,
    q18_no: true,
    q18_explain: '',
    q19_yes: false,
    q19_no: true,
    q19_explain: '',
    q20_store_yes: false,
    q20_store_no: true,
    q20_approved_yes: false,
    q20_approved_no: true,
    q20_explain: '',
    q21_yes: false,
    q21_no: true,
    q21_explain: '',
    q22_yes: false,
    q22_no: true,
    q22_explain: '',
    q23_yes: false,
    q23_no: true,
    q23_pct: '',
    q23_max_height: '',
    q23_explain: '',
    q24_yes: false,
    q24_no: true,
    q24_pct: '',
    q24_max_depth: '',
    q24_explain: '',
    q25_yes: false,
    q25_no: true,
    q25_max_slope: '',
    q25_explain: '',
    q26_yes: false,
    q26_no: true,
    q26_heat_pct: '',
    q26_membrane_pct: '',
    q26_explain: '',
    q27_fired_yes: false,
    q27_fired_no: true,
    q27_replaced_yes: false,
    q27_replaced_no: true,
    q27_explain: '',
    
    // Claims Information
    claims_past5_yes: false,
    claims_past5_no: true,
    claims_past5_explain: '',
    claims_pending_yes: false,
    claims_pending_no: true,
    claims_pending_explain: '',
    knowledge_preexist_yes: false,
    knowledge_preexist_no: true,
    knowledge_preexist_explain: '',
    faulty_construction_yes: false,
    faulty_construction_no: true,
    faulty_construction_explain: '',
    breach_contract_yes: false,
    breach_contract_no: true,
    breach_contract_explain: '',
    
    // Signature
    applicant_print: '',
    applicant_title: '',
    applicant_sign: '',
    sign_date: ''
  }

  // Ensure we're on the client side before rendering theme-dependent content
  useEffect(() => {
    setIsClient(true)
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    let shouldBeDark = false
    if (savedTheme === 'dark') {
      shouldBeDark = true
    } else if (savedTheme === 'light') {
      shouldBeDark = false
    } else {
      shouldBeDark = prefersDark
      localStorage.setItem('theme', shouldBeDark ? 'dark' : 'light')
    }
    
    setIsDarkMode(shouldBeDark)
    
    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      console.log('Prefilled form submitted:', data)
      console.log('Requester info:', requesterInfo)
      
      // Validate requester info
      if (!requesterInfo.name || !requesterInfo.email) {
        alert('Por favor, preencha seu nome e email antes de enviar o formulário.')
        setIsSubmitting(false)
        return
      }
      
      // Prepare submission data for API
      const submissionData = {
        requester_name: requesterInfo.name,
        requester_email: requesterInfo.email,
        requester_company: requesterInfo.company || '',
        requester_phone: requesterInfo.phone || '',
        form_data: data
      }
      
      console.log('Sending submission to API:', submissionData)
      
      // Save to Supabase via API
      const response = await fetch('/api/public-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit form')
      }
      
      console.log('Prefilled submission created successfully:', result.data)
      
      // Also download as JSON file for backup
      const completeSubmission = {
        ...data,
        requester: requesterInfo,
        submitted_at: new Date().toISOString(),
        form_type: 'prefilled_contractor'
      }
      
      const blob = new Blob([JSON.stringify(completeSubmission, null, 2)], {
        type: 'application/json'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `prefilled-contractor-form-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert('Formulário enviado com sucesso!')
      
    } catch (error) {
      console.error('Error submitting prefilled form:', error)
      alert('Erro ao enviar formulário. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormChange = (data: any) => {
    setFormData(data)
  }

  const handleSaveAsDraft = async () => {
    try {
      const draftData = {
        ...formData,
        requester: requesterInfo,
        saved_at: new Date().toISOString(),
        form_type: 'prefilled_contractor_draft'
      }
      
      const blob = new Blob([JSON.stringify(draftData, null, 2)], {
        type: 'application/json'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `prefilled-contractor-draft-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert('Rascunho salvo com sucesso!')
      
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Erro ao salvar rascunho.')
    }
  }

  const handleExportJSON = () => {
    try {
      const exportData = {
        ...formData,
        requester: requesterInfo,
        exported_at: new Date().toISOString(),
        form_type: 'prefilled_contractor_export'
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `prefilled-contractor-export-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
    } catch (error) {
      console.error('Error exporting JSON:', error)
      alert('Erro ao exportar dados.')
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold">Formulário Pré-preenchido</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dados baseados no PDF de exemplo
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center space-x-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{isDarkMode ? 'Light' : 'Dark'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informações do Requerente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <Input
                    value={requesterInfo.name}
                    onChange={(e) => setRequesterInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome"
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={requesterInfo.email}
                    onChange={(e) => setRequesterInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Empresa</label>
                  <Input
                    value={requesterInfo.company}
                    onChange={(e) => setRequesterInfo(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Nome da empresa"
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <Input
                    value={requesterInfo.phone}
                    onChange={(e) => setRequesterInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(123) 456-7890"
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => handleFormSubmit(formData)}
                disabled={isSubmitting}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Enviando...' : 'Enviar Formulário'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSaveAsDraft}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Rascunho
              </Button>
              
              <Button
                variant="outline"
                onClick={handleExportJSON}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar JSON
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>Formulário Pré-preenchido - Giovanna Construction</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Este formulário vem com dados de exemplo baseados no PDF fornecido.
                  Você pode editar todos os campos conforme necessário.
                </p>
              </CardHeader>
              <CardContent>
                <ContractorForm
                  initialData={prefilledData}
                  onFormChange={handleFormChange}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 