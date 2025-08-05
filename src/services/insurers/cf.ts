const axios = require('axios')
import type { Quote } from '../../types/quotes'
import { logAPICall, createLogEntryFromAxios } from '../../lib/api-logger'

const CF_BASE_URL = process.env.CF_BASE_URL || 'https://policy.api-uat.cfins.io/api'

function buildCFCredentials(ourQuoteId: string, cnfQuoteNumber: string = '') {
  const username = process.env.CF_USERNAME || 'ws.UAT_test@novusunderwriters.com'
  const password = process.env.CF_PASSWORD || 'Welcome@12'
  
  console.log('CF Credentials:', {
    ServiceName: 'DCTAddOrUpdatePolicy',
    AgencyReferenceID: ourQuoteId,
    CNFQuoteNumber: cnfQuoteNumber,
    UserCredentials: {
      UserName: username ? '***' : 'MISSING',
      Password: password ? '***' : 'MISSING'
    }
  })

  return {
    ServiceName: 'DCTAddOrUpdatePolicy',
    AgencyReferenceID: ourQuoteId,
    CNFQuoteNumber: cnfQuoteNumber,
    UserCredentials: {
      UserName: username,
      Password: password
    }
  }
}

function transformQuoteData(quote: Quote) {
  // Map common classifications to proper GL class codes based on C&F sample
  const classificationMap: { [key: string]: string } = {
    'general construction': '10010',
    'construction': '10010',
    'contractor': '10010',
    'building construction': '10010',
    'residential construction': '10010',
    'commercial construction': '10010'
  }

  let classification = (quote.classification || quote.classification_code || '').toLowerCase();
  let glClassCode = classificationMap[classification] || '10010'; // Default to sample code

  console.log('GLClassCode processed:', {
    original: quote.classification || quote.classification_code,
    processed: glClassCode
  })

  // Support for multiple risk entries
  const risks = [
    {
      LocationNumber: "1",
      GLClassCode: glClassCode,
      Exposure: (quote.exposure_value || '15000').toString()
    }
  ];

  // Add a second risk if specified in the quote
  if (quote.additional_class_code) {
    risks.push({
      LocationNumber: "1",
      GLClassCode: quote.additional_class_code,
      Exposure: (quote.additional_exposure_value || '15000').toString()
    });
  }

  return {
    method: "AddNewDCTQuote",
    quoteDetails: {
      cnfPolicyService: {
        cnfPolicyHeader: {
          ...buildCFCredentials(quote.id || quote.quote_number || 'TEMP-' + Date.now(), '')
        },
        cnfPolicyData: {
          data: {
            account: {
              Name: quote.company_name,
              location: [
                {
                  Number: "1",
                  IsPrimaryLocation: "1",
                  Address1: quote.address_street || quote.location_address || "2724 Andrews Circle",
                  ZipCode: quote.address_zip || quote.zip || "76048"
                }
              ]
            },
            policy: {
              EffectiveDate: quote.policy_start_date || "2025-07-30",
              ExpirationDate: quote.policy_end_date || "2026-07-30",
              line: {
                Type: "GeneralLiability",
                Deductible: quote.coverage_limits?.deductible?.toString() || "0",
                PolicyPerOccurenceLimit: quote.coverage_limits?.per_occurrence?.toString() || "1000000",
                PolicyAggregateLimit: quote.coverage_limits?.aggregate?.toString() || "2000000",
                CoverageForm: "OCCURRENCE",
                risk: risks,
                optionalCoverages: {
                  WithPrimaryOrNonContributoryWording: "1",
                  AdditionalInsured: [
                    {
                      Form: "CG2011",
                      NumberOfInsureds: "4",
                      WOS: "4"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
}

interface CFResponse {
  cnfPolicyService: {
    cnfPolicyHeader: {
      ServiceName: string
      AgencyReferenceID: string
      CNFQuoteNumber: string
      EligibilityStatus?: string
      Status?: string
      Message?: string
      CNFExpressURL?: string
    }
    cnfPolicyData?: {
      data?: {
        policy?: {
          line?: {
            GLPremium?: string
          }
          FormsList?: {
            Form?: Array<{
              FormType: string
              RetrievalUrl: string
            }>
          }
        }
      }
    }
  }
}

interface CFBindResponse {
  PolicyNumber?: string
  Message?: string
  FormsList?: {
    Form?: Array<{
      FormType: string
      RetrievalUrl: string
    }>
  }
}

interface CFIssueResponse {
  PolicyNumber?: string
  Message?: string
  FormsList?: {
    Form?: Array<{
      FormType: string
      RetrievalUrl: string
    }>
  }
}

interface StandardizedQuoteResponse {
  success: boolean;
  quoteId: string;
  quoteNumber: string;
  premium?: string;
  status: 'quoted' | 'referred' | 'declined';
  message: string;
  carrier: 'CF' | 'Markel';
  rawResponse: any;
  eligibilityStatus?: string;
  policyUrl?: string;
  documents?: {
    type: string;
    url: string;
  }[];
}

interface StandardizedBindResponse {
  success: boolean;
  quoteId: string;
  quoteNumber: string;
  policyNumber?: string;
  status: 'bound' | 'failed';
  message: string;
  carrier: 'CF' | 'Markel';
  rawResponse: any;
  documents?: {
    type: string;
    url: string;
  }[];
}

interface StandardizedIssueResponse {
  success: boolean;
  quoteId: string;
  quoteNumber: string;
  policyNumber: string;
  status: 'issued' | 'failed';
  message: string;
  carrier: 'CF' | 'Markel';
  rawResponse: any;
  documents?: {
    type: string;
    url: string;
  }[];
}

export async function addCFQuote(quote: Quote): Promise<StandardizedQuoteResponse> {
  try {
    // Debug: Log environment variables status
    console.log('🔍 Environment variables check:', {
      CF_USERNAME: process.env.CF_USERNAME ? 'FOUND' : 'MISSING',
      CF_PASSWORD: process.env.CF_PASSWORD ? 'FOUND' : 'MISSING',
      CF_API_KEY: process.env.CF_API_KEY ? 'FOUND' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV
    })
    
    // Validate required environment variables
    if (!process.env.CF_USERNAME || !process.env.CF_PASSWORD) {
      throw new Error('CF_USERNAME and CF_PASSWORD environment variables are required')
    }
    
    if (!process.env.CF_API_KEY) {
      console.warn('CF_API_KEY not found in environment variables')
    }
    
    const requestData = transformQuoteData(quote)
    
    const axiosConfig = {
      url: `${CF_BASE_URL}/quote`,
      method: 'post' as const,
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CF_API_KEY || 'Xr4htDnCPv2pm6lFMFzjF8UWUv4gM8w62MRHhPlh'
      },
      timeout: 30000
    }

    const response = await axios(axiosConfig)

    // Log successful API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      quote.id,
      quote.quote_number,
      'quote',
      'CF',
      axiosConfig,
      response
    ))

    const quoteResponse = (response.data as any)[0] as CFResponse
    const cnfQuoteNumber = quoteResponse?.cnfPolicyService?.cnfPolicyHeader?.CNFQuoteNumber
    
    console.log('CNFQuoteNumber returned by C&F:', cnfQuoteNumber)
    
    // Map CF response to standardized format
    const standardResponse: StandardizedQuoteResponse = {
      success: true,
      quoteId: quote.id || quote.quote_number || 'TEMP-' + Date.now(),
      quoteNumber: cnfQuoteNumber,
      premium: quoteResponse?.cnfPolicyService?.cnfPolicyData?.data?.policy?.line?.GLPremium,
      status: quoteResponse?.cnfPolicyService?.cnfPolicyHeader?.EligibilityStatus?.toLowerCase() === 'eligible' ? 'quoted' : 'referred',
      message: quoteResponse?.cnfPolicyService?.cnfPolicyHeader?.Message || 'Quote created successfully',
      carrier: 'CF',
      rawResponse: quoteResponse,
      eligibilityStatus: quoteResponse?.cnfPolicyService?.cnfPolicyHeader?.EligibilityStatus,
      policyUrl: quoteResponse?.cnfPolicyService?.cnfPolicyHeader?.CNFExpressURL,
      documents: []
    }

    // Add quote letter if available
    if (quoteResponse?.cnfPolicyService?.cnfPolicyData?.data?.policy?.FormsList?.Form) {
      standardResponse.documents = quoteResponse.cnfPolicyService.cnfPolicyData.data.policy.FormsList.Form
        .map((form: any) => ({
          type: form.FormType,
          url: form.RetrievalUrl
        }))
    }

    // Add quote letter URL if available
    if (quoteResponse?.cnfPolicyService?.cnfPolicyHeader?.CNFExpressURL) {
      standardResponse.documents = standardResponse.documents || []
      standardResponse.documents.push({
        type: 'QuoteLetter',
        url: quoteResponse.cnfPolicyService.cnfPolicyHeader.CNFExpressURL
      })
    }

    return standardResponse

  } catch (error: any) {
    // Log failed API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      quote.id,
      quote.quote_number,
      'quote',
      'CF',
      error.config || {
        url: `${CF_BASE_URL}/quote`,
        method: 'post',
        data: transformQuoteData(quote),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CF_API_KEY || 'Xr4htDnCPv2pm6lFMFzjF8UWUv4gM8w62MRHhPlh'
        }
      },
      null,
      error
    ))

    console.error('Error creating C&F quote:', error.response?.data || error.message)
    
    // Return standardized error response
    return {
      success: false,
      quoteId: quote.id || quote.quote_number || 'TEMP-' + Date.now(),
      quoteNumber: '',
      status: 'declined',
      message: error.response?.data?.message || error.message || 'Failed to create quote',
      carrier: 'CF',
      rawResponse: error.response?.data || error.message
    }
  }
}

export async function bindCFQuote(ourQuoteId: string, cnfQuoteNumber: string): Promise<StandardizedBindResponse> {
  try {
    // Para bind, precisamos do CNFQuoteNumber retornado pela C&F na criação da cotação
    const requestData = {
      cnfPolicyService: {
        cnfPolicyHeader: {
          ...buildCFCredentials(ourQuoteId, cnfQuoteNumber),
          MethodName: "BindDCTQuote"
        }
      }
    }

    console.log('Binding C&F quote:', JSON.stringify(requestData, null, 2))

    const axiosConfig = {
      url: `${CF_BASE_URL}/bind`,
      method: 'post' as const,
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CF_API_KEY || 'Xr4htDnCPv2pm6lFMFzjF8UWUv4gM8w62MRHhPlh'
      },
      timeout: 30000
    }

    const response = await axios(axiosConfig)

    // Log successful API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      ourQuoteId,
      cnfQuoteNumber,
      'bind',
      'CF',
      axiosConfig,
      response
    ))

    const bindResponse = response.data as CFBindResponse
    
    // Map CF bind response to standardized format
    const standardResponse: StandardizedBindResponse = {
      success: true,
      quoteId: ourQuoteId,
      quoteNumber: cnfQuoteNumber,
      policyNumber: bindResponse?.PolicyNumber,
      status: 'bound',
      message: bindResponse?.Message || 'Policy bound successfully',
      carrier: 'CF',
      rawResponse: bindResponse,
      documents: []
    }

    // Add bind documents if available
    if (bindResponse?.FormsList?.Form) {
      standardResponse.documents = bindResponse.FormsList.Form
        .map((form: any) => ({
          type: form.FormType,
          url: form.RetrievalUrl
        }))
    }

    return standardResponse

  } catch (error: any) {
    // Log failed API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      ourQuoteId,
      cnfQuoteNumber,
      'bind',
      'CF',
      error.config || {
        url: `${CF_BASE_URL}/bind`,
        method: 'post',
        data: {
          cnfPolicyService: {
            cnfPolicyHeader: {
              ...buildCFCredentials(ourQuoteId, cnfQuoteNumber),
              MethodName: "BindDCTQuote"
            }
          }
        },
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CF_API_KEY || 'Xr4htDnCPv2pm6lFMFzjF8UWUv4gM8w62MRHhPlh'
        }
      },
      null,
      error
    ))

    console.error('Error binding C&F quote:', error.response?.data || error.message)
    
    // Return standardized error response
    return {
      success: false,
      quoteId: ourQuoteId,
      quoteNumber: cnfQuoteNumber,
      status: 'failed',
      message: error.response?.data?.message || error.message || 'Failed to bind policy',
      carrier: 'CF',
      rawResponse: error.response?.data || error.message
    }
  }
}

export async function issueCFPolicy(ourQuoteId: string, cnfQuoteNumber: string): Promise<StandardizedIssueResponse> {
  try {
    const requestData = {
      cnfPolicyService: {
        cnfPolicyHeader: {
          ...buildCFCredentials(ourQuoteId, cnfQuoteNumber),
          MethodName: "IssueDCTPolicy"
        }
      }
    }

    console.log('Issuing C&F policy:', JSON.stringify(requestData, null, 2))

    const axiosConfig = {
      url: `${CF_BASE_URL}/issue`,
      method: 'post' as const,
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CF_API_KEY || 'Xr4htDnCPv2pm6lFMFzjF8UWUv4gM8w62MRHhPlh'
      },
      timeout: 30000
    }

    const response = await axios(axiosConfig)

    // Log successful API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      ourQuoteId,
      cnfQuoteNumber,
      'issue',
      'CF',
      axiosConfig,
      response
    ))

    const issueResponse = response.data as CFIssueResponse
    
    // Map CF issue response to standardized format
    const standardResponse: StandardizedIssueResponse = {
      success: true,
      quoteId: ourQuoteId,
      quoteNumber: cnfQuoteNumber,
      policyNumber: issueResponse?.PolicyNumber || '',
      status: 'issued',
      message: issueResponse?.Message || 'Policy issued successfully',
      carrier: 'CF',
      rawResponse: issueResponse,
      documents: []
    }

    // Add policy documents if available
    if (issueResponse?.FormsList?.Form) {
      standardResponse.documents = issueResponse.FormsList.Form
        .map((form: any) => ({
          type: form.FormType,
          url: form.RetrievalUrl
        }))
    }

    return standardResponse

  } catch (error: any) {
    // Log failed API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      ourQuoteId,
      cnfQuoteNumber,
      'issue',
      'CF',
      error.config || {
        url: `${CF_BASE_URL}/issue`,
        method: 'post',
        data: {
          cnfPolicyService: {
            cnfPolicyHeader: {
              ...buildCFCredentials(ourQuoteId, cnfQuoteNumber),
              MethodName: "IssueDCTPolicy"
            }
          }
        },
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CF_API_KEY || 'Xr4htDnCPv2pm6lFMFzjF8UWUv4gM8w62MRHhPlh'
        }
      },
      null,
      error
    ))

    console.error('Error issuing C&F policy:', error.response?.data || error.message)
    
    // Return standardized error response
    return {
      success: false,
      quoteId: ourQuoteId,
      quoteNumber: cnfQuoteNumber,
      policyNumber: '',
      status: 'failed',
      message: error.response?.data?.message || error.message || 'Failed to issue policy',
      carrier: 'CF',
      rawResponse: error.response?.data || error.message
    }
  }
}