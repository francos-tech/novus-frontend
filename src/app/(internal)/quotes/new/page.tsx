'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Send, Link, Copy } from 'lucide-react'
import ContractorForm from './contractor-form'

export default function NewQuotePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [copySuccess, setCopySuccess] = useState(false)

  // Form data will be managed by the ContractorForm component

  const transformFormDataToQuote = (formData: any): any => {
    // Generate unique ID
    const quoteId = `Q-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
    const exposureValue = parseFloat(formData.exposure_value || formData.annual_revenue || '1000000')
    
    // Transform form data to Quote format (compatible with both APIs and board display)
    const quote = {
      // Board display fields
      id: quoteId,
      company: formData.applicant_name || formData.company_name || 'New Company',
      description: `General Liability Insurance for ${formData.applicant_name || 'Contractor'}`,
      type: 'General Liability',
      broker: 'System Generated',
      value: `$${exposureValue.toLocaleString()}`,
      priority: 'Medium Priority',
      status: 'Pending',
      updated: 'just now',
      date: new Date().toISOString().split('T')[0],
      
      // API fields (Quote type)
      company_name: formData.applicant_name || formData.company_name || '',
      applicant_name: formData.applicant_name || '',
      email: formData.email || '',
      phone: formData.phone || formData.business_phone || '',
      policy_type: 'general' as const,
      classification_code: formData.classification_code || '54251',
      classification: formData.classification || 'General Construction',
      exposure_value: exposureValue,
      start_date: formData.policy_start_date || new Date().toISOString().split('T')[0],
      end_date: formData.policy_end_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      address: `${formData.address || ''} ${formData.city || ''} ${formData.state || ''} ${formData.zip || ''}`.trim(),
      address_street: formData.address || '',
      city: formData.city || '',
      state: formData.state || 'CA',
      zip: formData.zip || '',
      address_zip: formData.zip || '',
      coverage_limits: {
        per_occurrence: parseFloat(formData.per_occurrence_limit || '1000000'),
        aggregate: parseFloat(formData.aggregate_limit || '2000000'),
        products: parseFloat(formData.products_limit || '1000000'),
        deductible: parseFloat(formData.deductible || '5000'),
        personal_injury: parseFloat(formData.personal_injury_limit || '1000000'),
        rented_premises: parseFloat(formData.rented_premises_limit || '100000'),
        medical_expense: parseFloat(formData.medical_expense_limit || '5000')
      },
      created_at: new Date().toISOString(),
      created_by: 'system',
      
      // Store original form data for reference
      formData: formData
    }

    return quote
  }

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      console.log('Form submitted with data:', data)
      
      // Transform form data to Quote format for API
      const quoteData = {
        company_name: data.company_name || data.applicant_name || '',
        applicant_name: data.applicant_name || data.company_name || '',
        email: data.email || '',
        phone: data.phone || data.business_phone || '',
        policy_type: 'general_liability',
        classification: data.classification || data.business_type || 'General Construction',
        exposure_value: parseFloat(data.exposure_value || data.annual_revenue || '1000000'),
        start_date: data.start_date || data.policy_start_date || new Date().toISOString().split('T')[0],
        end_date: data.end_date || data.policy_end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        address_street: data.location_address || data.address || data.business_address || '',
        address_city: data.city || '',
        address_state: data.state || '',
        address_zip: data.zip || data.zipcode || '',
        address_country: 'USA',
        coverage_limits: {
          per_occurrence: parseFloat(data.per_occurrence_limit || '1000000'),
          aggregate: parseFloat(data.aggregate_limit || '2000000'),
          products: parseFloat(data.products_limit || '1000000'),
          deductible: parseFloat(data.deductible || '5000'),
          personal_injury: parseFloat(data.personal_injury_limit || '1000000'),
          rented_premises: parseFloat(data.rented_premises_limit || '100000'),
          medical_expense: parseFloat(data.medical_expense_limit || '5000')
        },
        additional_info: data.additional_info || '',
        destination: data.destination || 'caixa_geral',
        created_by: 'internal_form',
        form_data: data // Store original form data
      }
      
      console.log('Sending quote data to API:', quoteData)
      
      // Save to Supabase via API
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        console.error('API Error Response:', result)
        throw new Error(result.error || 'Failed to create quote')
      }
      
      console.log('Quote created successfully:', result.data)
      
      // Clear draft if exists
      localStorage.removeItem('quote_draft')
      
      alert('Quote created successfully! Redirecting to quotes page...')
      
      // Redirect to quotes page
      setTimeout(() => {
        router.push('/quotes')
      }, 1000)
      
    } catch (error: any) {
      console.error('Error submitting quote:', error)
      alert(`Error creating quote: ${error.message}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAsDraft = async () => {
    try {
      // Use current formData if available
      if (!formData || Object.keys(formData).length === 0) {
        alert('Por favor, preencha o formulário antes de salvar como rascunho.')
        return
      }

      const draftData = {
        draft_type: 'quote',
        form_data: formData,
        created_by: 'internal_form',
        session_id: typeof window !== 'undefined' ? window.sessionStorage.getItem('session_id') || 'unknown' : 'unknown'
      }

      // Save to Supabase via API
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save draft')
      }

      console.log('Draft saved successfully:', result.data)
      alert('Rascunho salvo com sucesso!')
      
    } catch (error: any) {
      console.error('Erro ao salvar rascunho:', error)
      alert(`Erro ao salvar rascunho: ${error.message}. Por favor, tente novamente.`)
    }
  }

  const handleCopyPublicLink = async () => {
    try {
      const publicUrl = `${window.location.origin}/contractor-form`
      await navigator.clipboard.writeText(publicUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Error copying link:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = `${window.location.origin}/contractor-form`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quotes
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Quote</h1>
            <p className="text-muted-foreground">Create a new insurance quote</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyPublicLink}
            className="text-blue-600 hover:text-blue-700"
          >
            {copySuccess ? (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Link className="w-4 h-4 mr-2" />
                Copy Public Link
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleSaveAsDraft}
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button 
            onClick={() => handleFormSubmit(formData)}
            disabled={isSubmitting || !formData || Object.keys(formData).length === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Creating Quote...' : 'Create Quote'}
          </Button>
        </div>
      </div>

      {/* Form Container */}
      <Card>
        <CardHeader>
          <CardTitle>Contractor Application Form</CardTitle>
          <p className="text-sm text-muted-foreground">
            Fill out the form below to generate a new insurance quote
          </p>
        </CardHeader>
        <CardContent>
          {/* React Form Component */}
          <ContractorForm
            onFormChange={setFormData}
            onFormSubmit={handleFormSubmit}
            initialData={formData}
          />
        </CardContent>
      </Card>
    </div>
  )
} 