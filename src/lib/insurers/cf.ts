import * as axios from 'axios'
import type { Quote } from '../../src/types/quotes'

// Configuração da API C&F
const CF_BASE_URL = process.env.CF_BASE_URL || 'https://policy-uat.cfins.io/api'

function buildCFCredentials(ourQuoteId: string, cnfQuoteNumber: string = '') {
  const credentials = {
    ServiceName: process.env.CF_SERVICE_NAME || 'DCTAddOrUpdatePolicy',
    AgencyReferenceID: ourQuoteId, // UUID da nossa cotação (nossa referência)
    CNFQuoteNumber: cnfQuoteNumber, // String vazia inicialmente, preenchida pela C&F depois
    UserCredentials: {
      UserName: process.env.CF_USERNAME || 'admin',
      Password: process.env.CF_PASSWORD || 'Welcome@12'
    }
  }
  
  // Log para debug (remover em produção)
  console.log('CF Credentials:', {
    ...credentials,
    UserCredentials: {
      UserName: credentials.UserCredentials.UserName ? '***' : 'MISSING',
      Password: credentials.UserCredentials.Password ? '***' : 'MISSING'
    }
  })
  
  return credentials
}

function transformQuoteData(quote: Quote) {
  // Map common classifications to valid C&F GL class codes
  const classificationMap: { [key: string]: string } = {
    'general construction': '12361',
    'construction': '12361', 
    'contractor': '12361',
    'contractors': '12361',
    'building construction': '12361',
    'residential construction': '12361',
    'commercial construction': '12361'
  }
  
  let classification = (quote.classification || quote.classification_code || '').toLowerCase();
  let glClassCode = classificationMap[classification] || '12361';
  
  // If no mapping found, default to valid C&F code
  if (glClassCode === '12361' && classification && !classificationMap[classification]) {
    // For unmapped classifications, still use the default valid code
    glClassCode = '12361';
  }
  
  // Ensure it's 5-6 characters
  if (glClassCode.length < 5) {
    glClassCode = glClassCode.padEnd(5, '0');
  } else if (glClassCode.length > 6) {
    glClassCode = glClassCode.substring(0, 6);
  }
  
  console.log('GLClassCode processed:', {
    original: quote.classification || quote.classification_code,
    processed: glClassCode
  })

  return {
    method: "AddNewDCTQuote",
    quoteDetails: {
      cnfPolicyService: {
        cnfPolicyHeader: {
          ...buildCFCredentials(quote.id || quote.quote_number || 'TEMP-' + Date.now(), '') // Nossa referência UUID, CNFQuoteNumber vazio inicialmente
        },
        cnfPolicyData: {
          data: {
            account: {
              Name: quote.company_name,
              location: [
                {
                  Number: "1",
                  IsPrimaryLocation: "1", // String "1" conforme OpenAPI spec
                  Address1: quote.address_street || quote.location_address,
                  ZipCode: quote.address_zip || quote.zip
                }
              ]
            },
            policy: {
              EffectiveDate: quote.policy_start_date,
              ExpirationDate: quote.policy_end_date,
              line: {
                Type: "GeneralLiability", // Corrected based on sample request
                Deductible: quote.coverage_limits?.deductible?.toString() || "1000",
                PolicyPerOccurenceLimit: quote.coverage_limits?.per_occurrence?.toString() || "1000000",
                PolicyAggregateLimit: quote.coverage_limits?.aggregate?.toString() || "2000000",
                CoverageForm: "OCCURRENCE",
                risk: [
                  {
                    LocationNumber: "1",
                    GLClassCode: glClassCode,
                    Exposure: (quote.exposure_value || '0').toString()
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

export async function createCFQuote(quote: Quote): Promise<any> {
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
  
  try {
    
    console.log('Creating C&F quote with real API:', JSON.stringify(requestData, null, 2))

    const response = await axios.post(
      `${CF_BASE_URL}/quote`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.CF_API_KEY && { 'X-API-Key': process.env.CF_API_KEY })
        },
        timeout: 30000
      }
    )

    console.log('C&F API Response:', response.data)

    // C&F retorna array, pegamos o primeiro item
    const quoteResponse = (response.data as any[])[0]
    const cnfQuoteNumber = quoteResponse?.cnfPolicyService?.cnfPolicyHeader?.CNFQuoteNumber
    
    console.log('CNFQuoteNumber returned by C&F:', cnfQuoteNumber)
    
    return {
      success: true,
      cnfQuoteNumber: cnfQuoteNumber, // Número da cotação retornado pela C&F
      cnfPolicyService: quoteResponse.cnfPolicyService,
      message: 'Quote created successfully'
    }

  } catch (error: any) {
    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      request: requestData, // Include the request data that was sent
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    }
    
    console.error('Error creating C&F quote:', errorDetails)
    
    // Create a detailed error object to be saved in the database
    const detailedError = new Error(`C&F API Error: ${error.response?.data?.message || error.message}`)
    ;(detailedError as any).details = errorDetails
    
    throw detailedError
  }
}

export async function bindCFQuote(ourQuoteId: string, cnfQuoteNumber: string): Promise<any> {
  try {
    // Para bind, precisamos do CNFQuoteNumber retornado pela C&F na criação da cotação
    const requestData = {
      method: "bind",
      quoteDetails: {
        cnfPolicyService: {
          cnfPolicyHeader: {
            ...buildCFCredentials(ourQuoteId, cnfQuoteNumber) // Nossa referência + CNFQuoteNumber da C&F
          },
          cnfPolicyData: {
            data: {} // Bind normalmente usa os dados já salvos
          }
        }
      }
    }

    const response = await axios.post(
      `${CF_BASE_URL}/bind`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.CF_API_KEY && { 'X-API-Key': process.env.CF_API_KEY })
        }
      }
    )

    return { success: true, bindId: (response.data as any[])[0].cnfPolicyService.cnfPolicyHeader.CNFQuoteNumber, data: (response.data as any[])[0] }
  } catch (error: any) {
    console.error('Error binding C&F quote:', error.response?.data || error.message)
    throw new Error(`C&F API Error: ${error.response?.data?.message || error.message}`)
  }
}

export async function issueCFPolicy(ourQuoteId: string, cnfQuoteNumber: string): Promise<any> {
  try {
    const requestData = {
      method: "issue",
      quoteDetails: {
        cnfPolicyService: {
          cnfPolicyHeader: {
            ...buildCFCredentials(ourQuoteId, cnfQuoteNumber) // Nossa referência + CNFQuoteNumber da C&F
          },
          cnfPolicyData: {
            data: {} // Issue normalmente não precisa de dados completos
          }
        }
      }
    }

    const response = await axios.post(
      `${CF_BASE_URL}/issue`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.CF_API_KEY && { 'X-API-Key': process.env.CF_API_KEY })
        }
      }
    )

    return { success: true, policyNumber: (response.data as any[])[0].cnfPolicyService.cnfPolicyHeader.PolicyNumber, data: (response.data as any[])[0] }
  } catch (error: any) {
    console.error('Error issuing C&F policy:', error.response?.data || error.message)
    throw new Error(`C&F API Error: ${error.response?.data?.message || error.message}`)
  }
}