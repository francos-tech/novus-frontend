import * as axios from 'axios'
import type { Quote } from '../../src/types/quotes'

// Configuração da API Markel
const MARKEL_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.markelcorp.com'
  : 'https://api-sandbox.markelcorp.com'

// Gerenciamento do token
let accessToken: string | null = null
let tokenExpiry: Date | null = null

interface MarkelAuthResponse {
  access_token: string
  expires_in: number
}

async function getMarkelToken(): Promise<string> {
  // Se temos um token válido, retornar
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken
  }

  // Debug: Verificar variáveis de ambiente
  console.log('🔍 Markel Environment variables check:', {
    MARKEL_API_KEY: process.env.MARKEL_API_KEY ? 'FOUND' : 'MISSING',
    MARKEL_USERNAME: process.env.MARKEL_USERNAME ? 'FOUND' : 'MISSING', 
    MARKEL_PASSWORD: process.env.MARKEL_PASSWORD ? 'FOUND' : 'MISSING',
    MARKEL_BASE_URL,
    NODE_ENV: process.env.NODE_ENV
  })

  // Validar variáveis obrigatórias
  if (!process.env.MARKEL_API_KEY || !process.env.MARKEL_USERNAME || !process.env.MARKEL_PASSWORD) {
    throw new Error('Missing required Markel environment variables: MARKEL_API_KEY, MARKEL_USERNAME, MARKEL_PASSWORD')
  }

  try {
    // Seguindo a documentação Postman: /mol/authorization/token?grant_type=password
    const authUrl = `${MARKEL_BASE_URL}/mol/authorization/token?grant_type=password`
    
    console.log('🔗 Markel Auth URL:', authUrl)

    const response = await axios.post<MarkelAuthResponse>(authUrl, {
      username: process.env.MARKEL_USERNAME,
      password: process.env.MARKEL_PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.MARKEL_API_KEY}:`).toString('base64')}`
      },
      timeout: 30000
    })

    console.log('✅ Markel token response received:', {
      status: response.status,
      hasToken: !!response.data?.access_token,
      expiresIn: response.data?.expires_in
    })

    if (!response.data.access_token) {
      throw new Error('No access token received')
    }

    accessToken = response.data.access_token
    // Definir expiração para 23 horas para ter margem de segurança
    tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000 * 0.95))

    return accessToken
  } catch (error: any) {
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url?.replace(process.env.MARKEL_API_KEY || '', '***'),
        method: error.config?.method,
        timeout: error.config?.timeout
      }
    }
    
    console.error('❌ Error getting Markel API token:', errorDetails)
    throw new Error(`Failed to get Markel API token: ${error.response?.data?.message || error.message}`)
  }
}

export async function createMarkelSubmission(quote: Quote): Promise<any> {
  try {
    const token = await getMarkelToken()
    
    // Transformar dados para o formato da Markel
    const markelData = {
      ClientTransactionReferenceId: quote.id,
      PolicyEffectiveDate: quote.policy_start_date,
      PolicyExpirationDate: quote.policy_end_date,
      HomeState: quote.address_state || 'CA',
      Insureds: {
        PrimaryNamedInsured: {
          Value: quote.applicant_name || quote.company_name,
          Address: {
            StreetAddress: quote.address_street || quote.location_address,
            City: quote.address_city || 'San Francisco',
            State: quote.address_state || 'CA',
            ZipCode: quote.address_zip || quote.zip
          },
          Email: quote.email
        }
      },
      ProducerInformation: {
        Producer: {
          Value: 'demo@novus.com'
        }
      },
      GeneralLiability: {
        GlRiskUnits: [{
          GlClassification: {
            Value: quote.classification_code || quote.classification || '54251'
          },
          Location: {
            LocationNumber: "1",
            Address: {
              StreetAddress: quote.address_street || quote.location_address,
              City: quote.address_city || 'San Francisco',
              State: quote.address_state || 'CA',
              ZipCode: quote.address_zip || quote.zip
            }
          },
          GlExposure: {
            Value: quote.exposure_value
          }
        }],
        GlLimitsAndDeductibles: {
          PerOccurrenceLimit: { Value: quote.coverage_limits?.per_occurrence || 1000000 },
          GeneralAggregateLimit: { Value: quote.coverage_limits?.aggregate || 2000000 },
          ProductsAggregateLimit: { Value: quote.coverage_limits?.products?.toString() || "1000000" },
          Deductible: { Value: quote.coverage_limits?.deductible || 5000 },
          PersonalAndAdvertisingInjuryLimit: { Value: quote.coverage_limits?.personal_injury?.toString() || "1000000" },
          DamageToRentedPremisesLimit: { Value: quote.coverage_limits?.rented_premises?.toString() || "100000" },
          MedicalExpenseLimit: { Value: quote.coverage_limits?.medical_expense?.toString() || "5000" }
        }
      }
    }

    console.log('Creating Markel submission with real API:', markelData)

    const response = await axios.post(
      `${MARKEL_BASE_URL}/mol/v2/submissions`,
      markelData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    console.log('Markel API Response:', response.data)

    return {
      success: true,
      submissionNumber: (response.data as any).SubmissionNumber,
      status: (response.data as any).Status,
      premium: (response.data as any).Premium,
      message: 'Submission created successfully',
      data: response.data
    }

  } catch (error: any) {
    console.error('Error creating Markel submission:', error.response?.data || error.message)
    throw new Error(`Markel API Error: ${error.response?.data?.message || error.message}`)
  }
}

export async function getMarkelQuoteLetter(submissionId: string): Promise<any> {
  try {
    const token = await getMarkelToken()
    
    const response = await axios.get(
      `${MARKEL_BASE_URL}/mol/v2/submissions/${submissionId}/documents`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return { success: true, documents: response.data }
  } catch (error: any) {
    console.error('Error getting Markel quote letter:', error.response?.data || error.message)
    throw new Error(`Markel API Error: ${error.response?.data?.message || error.message}`)
  }
}

export async function bindMarkelQuote(quoteId: string): Promise<any> {
  try {
    const token = await getMarkelToken()
    
    const response = await axios.post(
      `${MARKEL_BASE_URL}/mol/v2/submissions/${quoteId}/bind`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return { success: true, bindId: (response.data as any).BindId, data: response.data }
  } catch (error: any) {
    console.error('Error binding Markel quote:', error.response?.data || error.message)
    throw new Error(`Markel API Error: ${error.response?.data?.message || error.message}`)
  }
}

export async function issueMarkelPolicy(bindId: string): Promise<any> {
  try {
    const token = await getMarkelToken()
    
    const response = await axios.post(
      `${MARKEL_BASE_URL}/mol/v2/policies/issue`,
      { bindId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return { success: true, policyNumber: (response.data as any).PolicyNumber, data: response.data }
  } catch (error: any) {
    console.error('Error issuing Markel policy:', error.response?.data || error.message)
    throw new Error(`Markel API Error: ${error.response?.data?.message || error.message}`)
  }
}

// Export do token getter para uso em outros lugares
export { getMarkelToken } 