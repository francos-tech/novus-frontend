'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Send, Save, Sun, Moon, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ContractorForm from '@/app/(internal)/quotes/new/contractor-form'

export default function PublicContractorFormPage() {
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
      console.log('Public form submitted:', data)
      console.log('Requester info:', requesterInfo)
      
      // Prepare submission data for API
      const submissionData = {
        requester_name: requesterInfo.name,
        requester_email: requesterInfo.email,
        requester_company: requesterInfo.company,
        requester_phone: requesterInfo.phone,
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
      
      console.log('Public submission created successfully:', result.data)
      
      // Also download as JSON file for backup
      const completeSubmission = {
        ...data,
        requester: requesterInfo,
        submission_type: 'public',
        submitted_at: new Date().toISOString(),
        submission_id: result.data.id
      }
      
      const dataStr = JSON.stringify(completeSubmission, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `contractor-application-${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      alert('Form submitted successfully! We will contact you soon. Data also downloaded as backup.')
      
      // Clear form after successful submission
      setFormData({})
      setRequesterInfo({ name: '', email: '', company: '', phone: '' })
      
    } catch (error: any) {
      console.error('Error submitting form:', error)
      alert(`Error submitting form: ${error.message}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAsDraft = async () => {
    if (!formData || Object.keys(formData).length === 0) {
      alert('Please fill out the form before saving as draft.')
      return
    }

    try {
      const draftData = {
        draft_type: 'public_submission',
        form_data: {
          ...formData,
          requester_info: requesterInfo
        },
        created_by: 'public_form',
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
      alert('Draft saved successfully!')
      
    } catch (error: any) {
      console.error('Error saving draft:', error)
      alert(`Error saving draft: ${error.message}. Please try again.`)
    }
  }

  const handleExportJSON = () => {
    if (!formData || Object.keys(formData).length === 0) {
      alert('Please fill out the form before exporting.')
      return
    }

    const dataStr = JSON.stringify(formData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `contractor-form-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Don't render theme-dependent content until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full min-h-screen flex flex-col">
          <div className="w-full bg-card border-b border-border px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-foreground">Novus Underwriters</h1>
                <span className="text-sm text-muted-foreground">Public Application</span>
              </div>
            </div>
          </div>
          <div className="flex-1 py-8 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Contractor Application Form
                </h1>
                <p className="text-muted-foreground">
                  Loading...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full screen container without sidebar */}
      <div className="w-full min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <div className="w-full bg-card border-b border-border px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-foreground">Novus Underwriters</h1>
              <span className="text-sm text-muted-foreground">Public Application</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="bg-background hover:bg-accent"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Contractor Application Form
              </h1>
              <p className="text-muted-foreground">
                Complete this form to apply for contractor insurance coverage
              </p>
            </div>

            {/* Requester Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Requester Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Please identify yourself as the person requesting this quote
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name *
                    </label>
                    <Input
                      required
                      value={requesterInfo.name}
                      onChange={(e) => setRequesterInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Email *
                    </label>
                    <Input
                      type="email"
                      required
                      value={requesterInfo.email}
                      onChange={(e) => setRequesterInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Company
                    </label>
                    <Input
                      value={requesterInfo.company}
                      onChange={(e) => setRequesterInfo(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Phone
                    </label>
                    <Input
                      type="tel"
                      value={requesterInfo.phone}
                      onChange={(e) => setRequesterInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Container */}
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Please fill out all required fields marked with an asterisk (*)
                </p>
              </CardHeader>
              <CardContent>
                <ContractorForm
                  onFormChange={setFormData}
                  onFormSubmit={handleFormSubmit}
                  initialData={formData}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8 mb-8">
              <Button 
                variant="outline"
                onClick={handleSaveAsDraft}
                disabled={!formData || Object.keys(formData).length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                variant="outline"
                onClick={handleExportJSON}
                disabled={!formData || Object.keys(formData).length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button 
                onClick={() => handleFormSubmit(formData)}
                disabled={
                  isSubmitting || 
                  !formData || 
                  Object.keys(formData).length === 0 ||
                  !requesterInfo.name.trim() ||
                  !requesterInfo.email.trim()
                }
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-muted-foreground">
              <p>
                This form includes validation, export, and accessibility features. 
                All data is processed securely and in compliance with privacy regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 