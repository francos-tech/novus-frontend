'use client'

import { useState } from 'react'

export default function TestAPIs() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const testQuote = {
    company_name: "Test Construction Co",
    applicant_name: "John Doe",
    email: "test@example.com",
    phone: "555-123-4567",
    policy_type: "general_liability",
    classification: "general construction",
    exposure_value: "150000",
    start_date: "2025-01-01",
    end_date: "2026-01-01",
    address_street: "123 Main St",
    address_city: "Richmond",
    address_state: "VA",
    address_zip: "23220",
    coverage_limits: {
      per_occurrence: 1000000,
      aggregate: 2000000,
      deductible: 1000
    },
    destination: "test",
    created_by: "test-user",
    selected_insurers: ["CF", "Markel"]
  }

  const handleTest = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testQuote)
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to create quote')
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Test API Integration</h1>
      
      <div className="mb-6">
        <button
          onClick={handleTest}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
        >
          {loading ? 'Testing...' : 'Test Quote Submission'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded">
            <strong>Success!</strong> Quote created and sent to insurers
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Quote Details</h2>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 max-h-60 overflow-y-auto">
              {JSON.stringify(result.data.quote, null, 2)}
            </pre>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Insurer Responses</h2>
            {result.data.insurerResponses.map((response: any, index: number) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700">
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  {response.carrier} - {response.success ? 'Success' : 'Failed'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm dark:text-gray-200">
                  <div>
                    <strong>Status:</strong> {response.status}
                  </div>
                  <div>
                    <strong>Quote Number:</strong> {response.quoteNumber || 'N/A'}
                  </div>
                  <div>
                    <strong>Premium:</strong> {response.premium || 'N/A'}
                  </div>
                  <div>
                    <strong>Message:</strong> {response.message}
                  </div>
                </div>
                {response.documents && response.documents.length > 0 && (
                  <div className="mt-2">
                    <strong className="dark:text-white">Documents:</strong>
                    <ul className="list-disc list-inside ml-4 dark:text-gray-200">
                      {response.documents.map((doc: any, docIndex: number) => (
                        <li key={docIndex}>
                          {doc.type}: {doc.url}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Final Status</h2>
            <p className="text-lg dark:text-gray-200">
              <strong>Status:</strong> {result.data.finalStatus}
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 