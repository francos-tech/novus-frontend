const axios = require('axios')
import type { Quote, ContractorFormData } from '../../types/quotes'
import { logAPICall, createLogEntryFromAxios } from '../../lib/api-logger'

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

interface MarkelQuoteResponse {
  SubmissionNumber: string;
  Bindable: boolean;
  PolicyEffectiveDate: string;
  PolicyExpirationDate: string;
  Premium?: string;
  Status?: string;
  Message?: string;
  Documents?: Array<{
    Type: string;
    Url: string;
  }>;
}

interface MarkelAuthResponse {
  access_token: string
  expires_in: number
}

// Cache para o token da Markel
let markelTokenCache: { token: string; expiresAt: number } | null = null

export async function getMarkelToken(): Promise<string> {
  // Verificar se temos um token válido em cache
  if (markelTokenCache && Date.now() < markelTokenCache.expiresAt) {
    return markelTokenCache.token
  }

  const { tokenUserName, tokenPassword, apiKey, apiSecret, baseUrl } = buildMarkelCredentials()

  try {
    // Seguindo a documentação Postman: /mol/authorization/token?grant_type=password
    const axiosConfig = {
      url: `${baseUrl}/mol/authorization/token?grant_type=password`,
      method: 'post',
      data: {
        username: tokenUserName,
        password: tokenPassword
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`
      }
    }

    const response = await axios(axiosConfig)

    // Log successful API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      undefined,
      undefined,
      'other',
      'Markel',
      axiosConfig,
      response
    ))

    const accessToken = response.data.access_token
    const expiresIn = response.data.expires_in || 3600 // 1 hora padrão
    
    // Cache o token com expiração (5 minutos antes do vencimento real)
    markelTokenCache = {
      token: accessToken,
      expiresAt: Date.now() + (expiresIn - 300) * 1000
    }

    return accessToken
  } catch (error: any) {
    console.error('Error getting Markel token:', error.response?.data || error.message)
    throw new Error(`Markel Auth Error: ${error.response?.data?.message || error.message}`)
  }
}

function buildMarkelCredentials() {
  const tokenUserName = process.env.MARKEL_TOKEN_USERNAME || process.env.MARKEL_USERNAME || ''
  const tokenPassword = process.env.MARKEL_TOKEN_PASSWORD || process.env.MARKEL_PASSWORD || ''
  const apiKey = process.env.MARKEL_API_KEY || ''
  const apiSecret = process.env.MARKEL_API_SECRET || process.env.MARKEL_PASSWORD || ''
  const baseUrl = process.env.MARKEL_BASE_URL || 'https://api-sandbox.markelcorp.com'

  if (!tokenUserName || !tokenPassword || !apiKey) {
    throw new Error('MARKEL_TOKEN_USERNAME, MARKEL_TOKEN_PASSWORD, and MARKEL_API_KEY environment variables are required')
  }

  return {
    tokenUserName,
    tokenPassword,
    apiKey,
    apiSecret,
    baseUrl
  }
}

function transformQuoteData(quote: Quote) {
  return {
    submission: {
      applicant: {
        name: quote.company_name || quote.applicant_name,
        email: quote.email,
        phone: quote.phone,
        address: {
          street: quote.address_street,
          city: quote.address_city,
          state: quote.address_state,
          zip: quote.address_zip
        }
      },
      business: {
        website: quote.website,
        states: quote.business_states?.split(',').map(s => s.trim()),
        yearsInBusiness: parseInt(quote.years_current_mgmt || '0'),
        annualPayroll: parseFloat(quote.payroll_projected || '0'),
        annualReceipts: parseFloat(quote.receipts_projected || '0'),
        subcontractorCosts: parseFloat(quote.subcontractors_projected || '0'),
        percentCommercial: parseFloat(quote.pct_commercial || '0'),
        percentNewConstruction: parseFloat(quote.pct_building || '0')
      },
      coverage: {
        type: 'GL',
        exposureValue: parseFloat(quote.exposure_value || '0'),
        generalAggregate: parseFloat(quote.general_aggregate || '0'),
        effectiveDate: quote.policy_start_date,
        expirationDate: quote.policy_end_date
      }
    }
  }
}

function transformContractorDataForMarkel(quote: Quote, formData: ContractorFormData) {
  // Mapear dados do formulário de contratante para a API da Markel
  const residentialPct = parseFloat(formData.residential_new || '0') + parseFloat(formData.residential_remodel || '0')
  const commercialPct = parseFloat(formData.commercial_new || '0') + parseFloat(formData.commercial_remodel || '0')
  const newConstructionPct = parseFloat(formData.residential_new || '0') + parseFloat(formData.commercial_new || '0')
  
  // Determinar se usa subcontratados
  const usesSubcontractors = formData.pct_work_subbed && parseFloat(formData.pct_work_subbed) > 0
  
  // Determinar se tem claims
  const hasClaims = formData.claims_past5_yes || formData.claims_pending_yes || 
                   formData.faulty_construction_yes || formData.breach_contract_yes

  return {
    ClientTransactionReferenceId: `Quote-${quote.id || Date.now()}`,
    PolicyEffectiveDate: quote.policy_start_date || "2025-01-01",
    PolicyExpirationDate: quote.policy_end_date || "2026-01-01",
    HomeState: formData.states_worked?.split(',')[0]?.trim() || quote.address_state || "VA",
    Insureds: {
      PrimaryNamedInsured: {
        Value: formData.applicant_name || quote.company_name || quote.applicant_name || "Test Company",
        Address: {
          StreetAddress: formData.mailing_address_line1 || quote.address_street || "4501 Highwoods Pkwy",
          StreetAddress2: formData.mailing_address_line2 || "",
          City: quote.address_city || "Glen Allen",
          State: formData.states_worked?.split(',')[0]?.trim() || quote.address_state || "VA",
          ZipCode: quote.address_zip || "23060"
        },
        Email: quote.email || "test@test.com"
      }
    },
    ProducerInformation: {
      Producer: {
        Value: quote.email || "producer@domain.com"
      }
    },
    GeneralLiability: {
      GlRiskUnits: [
        {
          GlClassification: {
            Value: "91580" // General Construction
          },
          Location: {
            LocationNumber: "1",
            Address: {
              StreetAddress: formData.mailing_address_line1 || quote.address_street || "4501 Highwoods Pkwy",
              StreetAddress2: formData.mailing_address_line2 || "",
              City: quote.address_city || "Glen Allen",
              State: formData.states_worked?.split(',')[0]?.trim() || quote.address_state || "VA",
              ZipCode: quote.address_zip || "23060"
            }
          },
          GlExposure: {
            Value: parseFloat(quote.exposure_value || "100000")
          },
          UnderwritingQuestions: [
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: commercialPct > 50 ? "Yes" : "No"
                  }
                ]
              },
              Value: "Commercial Work"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: residentialPct <= 10 ? "less than 10% residential" : 
                           residentialPct <= 25 ? "10-25% residential" : 
                           residentialPct <= 50 ? "25-50% residential" : "more than 50% residential"
                  }
                ]
              },
              Value: "ResidentialWorkPortion"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: newConstructionPct > 0 ? "Yes" : "No"
                  }
                ]
              },
              Value: "Does the applicant work on any new residential construction"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: newConstructionPct <= 10 ? "less than 10% new" : 
                           newConstructionPct <= 25 ? "10-25% new" : 
                           newConstructionPct <= 50 ? "25-50% new" : "more than 50% new"
                  }
                ]
              },
              Value: "NewResidentialWorkPortion"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: usesSubcontractors ? "Yes" : "No"
                  }
                ]
              },
              Value: "Subcontractors Question"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: formData.written_contracts_yes ? "Yes" : "No"
                  }
                ]
              },
              Value: "Subcontractor Warranty"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: "No"
                  }
                ]
              },
              Value: "RemoveCG2294"
            }
          ]
        }
      ],
      GlLimitsAndDeductibles: {
        PerOccurrenceLimit: {
          Value: parseFloat(String(quote.coverage_limits?.per_occurrence || "1000000"))
        },
        GeneralAggregateLimit: {
          Value: parseFloat(String(quote.coverage_limits?.aggregate || "2000000"))
        },
        ProductsAggregateLimit: {
          Value: "2000000"
        },
        Deductible: {
          Value: parseFloat(String(quote.coverage_limits?.deductible || "1000"))
        },
        PersonalAndAdvertisingInjuryLimit: {
          Value: "1000000"
        },
        DamageToRentedPremisesLimit: {
          Value: "100000"
        },
        MedicalExpenseLimit: {
          Value: "1000"
        }
      },
      UnderwritingQuestions: [
        {
          AnswerInformation: {
            Answers: [
              {
                Value: hasClaims ? "No" : "Yes"
              }
            ]
          },
          Value: "MeetsEligibilityGuidelines"
        },
        {
          AnswerInformation: {
            Answers: [
              {
                Value: formData.licensed_yes ? "Yes" : "No"
              }
            ]
          },
          Value: "Licensed"
        },
                 {
           AnswerInformation: {
             Answers: [
               {
                 Value: formData.time_in_business || "0"
               }
             ]
           },
           Value: "YearsInBusiness"
         },
         {
           AnswerInformation: {
             Answers: [
               {
                 Value: formData.payroll_total || "0"
               }
             ]
           },
           Value: "AnnualPayroll"
         },
         {
           AnswerInformation: {
             Answers: [
               {
                 Value: formData.last_receipts || "0"
               }
             ]
           },
           Value: "AnnualReceipts"
         },
         {
           AnswerInformation: {
             Answers: [
               {
                 Value: formData.last_subs || "0"
               }
             ]
           },
           Value: "SubcontractorCosts"
         }
      ]
    }
  }
}

function transformQuoteDataForMarkel(quote: Quote) {
  // Se temos dados do formulário de contratante, usar o novo mapping
  if (quote.form_data) {
    return transformContractorDataForMarkel(quote, quote.form_data)
  }

  // Fallback para o mapping antigo
  return {
    ClientTransactionReferenceId: `Quote-${quote.id || Date.now()}`,
    PolicyEffectiveDate: quote.policy_start_date || "2025-01-01",
    PolicyExpirationDate: quote.policy_end_date || "2026-01-01",
    HomeState: quote.address_state || "VA",
    Insureds: {
      PrimaryNamedInsured: {
        Value: quote.company_name || quote.applicant_name || "Test Company",
        Address: {
          StreetAddress: quote.address_street || "4501 Highwoods Pkwy",
          StreetAddress2: "",
          City: quote.address_city || "Glen Allen",
          State: quote.address_state || "VA",
          ZipCode: quote.address_zip || "23060"
        },
        Email: quote.email || "test@test.com"
      }
    },
    ProducerInformation: {
      Producer: {
        Value: quote.email || "producer@domain.com"
      }
    },
    GeneralLiability: {
      GlRiskUnits: [
        {
          GlClassification: {
            Value: "91580" // General Construction
          },
          Location: {
            LocationNumber: "1",
            Address: {
              StreetAddress: quote.address_street || "4501 Highwoods Pkwy",
              StreetAddress2: "",
              City: quote.address_city || "Glen Allen",
              State: quote.address_state || "VA",
              ZipCode: quote.address_zip || "23060"
            }
          },
          GlExposure: {
            Value: parseFloat(quote.exposure_value || "100000")
          },
          UnderwritingQuestions: [
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: "No"
                  }
                ]
              },
              Value: "Commercial Work"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: "less than 10% residential"
                  }
                ]
              },
              Value: "ResidentialWorkPortion"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: "Yes"
                  }
                ]
              },
              Value: "Does the applicant work on any new residential construction"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: "less than 10% new"
                  }
                ]
              },
              Value: "NewResidentialWorkPortion"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: "No"
                  }
                ]
              },
              Value: "Subcontractors Question"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: "No"
                  }
                ]
              },
              Value: "Subcontractor Warranty"
            },
            {
              AnswerInformation: {
                Answers: [
                  {
                    Value: "No"
                  }
                ]
              },
              Value: "RemoveCG2294"
            }
          ]
        }
      ],
      GlLimitsAndDeductibles: {
        PerOccurrenceLimit: {
          Value: parseFloat(String(quote.coverage_limits?.per_occurrence || "1000000"))
        },
        GeneralAggregateLimit: {
          Value: parseFloat(String(quote.coverage_limits?.aggregate || "2000000"))
        },
        ProductsAggregateLimit: {
          Value: "2000000"
        },
        Deductible: {
          Value: parseFloat(String(quote.coverage_limits?.deductible || "1000"))
        },
        PersonalAndAdvertisingInjuryLimit: {
          Value: "1000000"
        },
        DamageToRentedPremisesLimit: {
          Value: "100000"
        },
        MedicalExpenseLimit: {
          Value: "1000"
        }
      },
      UnderwritingQuestions: [
        {
          AnswerInformation: {
            Answers: [
              {
                Value: "Yes"
              }
            ]
          },
          Value: "MeetsEligibilityGuidelines"
        }
      ]
    }
  }
}

export async function addMarkelQuote(quote: Quote): Promise<StandardizedQuoteResponse> {
  try {
    const { tokenUserName, tokenPassword, apiKey, apiSecret, baseUrl } = buildMarkelCredentials()
    
    // Primeiro obter o token
    const token = await getMarkelToken()
    
    // Transformar dados seguindo a estrutura da documentação Postman
    const requestData = transformQuoteDataForMarkel(quote)
    console.log('Creating Markel submission with data:', requestData)

    // Seguindo a documentação Postman: /mol/v2/Submission/Gl
    const axiosConfig = {
      url: `${baseUrl}/mol/v2/Submission/Gl`,
      method: 'post',
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }

    const response = await axios(axiosConfig)

    // Log successful API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      quote.id,
      quote.quote_number,
      'quote',
      'Markel',
      axiosConfig,
      response
    ))

    const markelResponse = response.data as MarkelQuoteResponse
    
    // Map Markel response to standardized format
    const standardResponse: StandardizedQuoteResponse = {
      success: true,
      quoteId: quote.id || quote.quote_number || 'TEMP-' + Date.now(),
      quoteNumber: markelResponse.SubmissionNumber,
      premium: markelResponse.Premium,
      status: markelResponse.Bindable ? 'quoted' : 'referred',
      message: markelResponse.Message || 'Quote created successfully',
      carrier: 'Markel',
      rawResponse: markelResponse,
      eligibilityStatus: markelResponse.Status,
      documents: markelResponse.Documents?.map(doc => ({
        type: doc.Type,
        url: doc.Url
      }))
    }

    return standardResponse

  } catch (error: any) {
    console.error('Error creating Markel submission:', error.response?.data || error.message)
    
    // Return standardized error response
    return {
      success: false,
      quoteId: quote.id || quote.quote_number || 'TEMP-' + Date.now(),
      quoteNumber: '',
      status: 'declined',
      message: error.response?.data?.message || error.message || 'Failed to create quote',
      carrier: 'Markel',
      rawResponse: error.response?.data || error.message
    }
  }
}

interface MarkelBindResponse {
  PolicyNumber?: string;
  Message?: string;
  Status?: string;
  Documents?: Array<{
    Type: string;
    Url: string;
  }>;
}

export async function bindMarkelQuote(submissionNumber: string): Promise<StandardizedBindResponse> {
  try {
    const { tokenUserName, tokenPassword, apiKey, apiSecret, baseUrl } = buildMarkelCredentials()
    
    // Primeiro obter o token
    const token = await getMarkelToken()

    // Seguindo a documentação Postman: /mol/v2/Submission/:submissionNumber/Bind
    const axiosConfig = {
      url: `${baseUrl}/mol/v2/Submission/${submissionNumber}/Bind`,
      method: 'post',
      data: {
        PolicyEffectiveDate: "2025-01-01",
        PolicyNumber: "",
        AssumedValues: {},
        OutstandingDataForBind: {}
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }

    const response = await axios(axiosConfig)

    // Log successful API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      undefined,
      submissionNumber,
      'bind',
      'Markel',
      axiosConfig,
      response
    ))

    const markelResponse = response.data as MarkelBindResponse
    
    // Map Markel bind response to standardized format
    const standardResponse: StandardizedBindResponse = {
      success: true,
      quoteId: submissionNumber,
      quoteNumber: submissionNumber,
      policyNumber: markelResponse.PolicyNumber,
      status: 'bound',
      message: markelResponse.Message || 'Policy bound successfully',
      carrier: 'Markel',
      rawResponse: markelResponse,
      documents: markelResponse.Documents?.map(doc => ({
        type: doc.Type,
        url: doc.Url
      }))
    }

    return standardResponse

  } catch (error: any) {
    console.error('Error binding Markel quote:', error.response?.data || error.message)
    
    // Return standardized error response
    return {
      success: false,
      quoteId: submissionNumber,
      quoteNumber: submissionNumber,
      status: 'failed',
      message: error.response?.data?.message || error.message || 'Failed to bind policy',
      carrier: 'Markel',
      rawResponse: error.response?.data || error.message
    }
  }
}

interface MarkelIssueResponse {
  PolicyNumber: string;
  Message?: string;
  Status?: string;
  PolicyUrl?: string;
  Documents?: Array<{
    Type: string;
    Url: string;
  }>;
}

export async function issueMarkelPolicy(submissionNumber: string): Promise<StandardizedIssueResponse> {
  try {
    const { tokenUserName, tokenPassword, apiKey, apiSecret, baseUrl } = buildMarkelCredentials()
    
    // Primeiro obter o token
    const token = await getMarkelToken()

    // Seguindo a documentação Postman: /mol/v2/Policy/:policyNumber/Issue
    const axiosConfig = {
      url: `${baseUrl}/mol/v2/Policy/${submissionNumber}/Issue`,
      method: 'post',
      data: {
        PolicyNumber: submissionNumber,
        Messages: [
          {
            Value: "Policy issued successfully",
            MessageType: "Info",
            InRe: 0
          }
        ],
        PrimaryNamedInsured: "Test Company",
        TransactionUrl: "",
        PolicyEffectiveDate: "2025-01-01",
        PolicyExpirationDate: "2026-01-01",
        PolicyUrl: "",
        Status: "Issued",
        NjslaTransactionNumber: ""
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }

    const response = await axios(axiosConfig)

    // Log successful API call (non-blocking)
    logAPICall(createLogEntryFromAxios(
      undefined,
      submissionNumber,
      'issue',
      'Markel',
      axiosConfig,
      response
    ))

    const markelResponse = response.data as MarkelIssueResponse
    
    // Map Markel issue response to standardized format
    const standardResponse: StandardizedIssueResponse = {
      success: true,
      quoteId: submissionNumber,
      quoteNumber: submissionNumber,
      policyNumber: markelResponse.PolicyNumber,
      status: 'issued',
      message: markelResponse.Message || 'Policy issued successfully',
      carrier: 'Markel',
      rawResponse: markelResponse,
      documents: markelResponse.Documents?.map(doc => ({
        type: doc.Type,
        url: doc.Url
      }))
    }

    return standardResponse

  } catch (error: any) {
    console.error('Error issuing Markel policy:', error.response?.data || error.message)
    
    // Return standardized error response
    return {
      success: false,
      quoteId: submissionNumber,
      quoteNumber: submissionNumber,
      policyNumber: submissionNumber,
      status: 'failed',
      message: error.response?.data?.message || error.message || 'Failed to issue policy',
      carrier: 'Markel',
      rawResponse: error.response?.data || error.message
    }
  }
}

export async function getMarkelQuoteLetter(submissionId: string): Promise<any> {
  try {
    const { tokenUserName, tokenPassword, apiKey, baseUrl } = buildMarkelCredentials()
    
    // Primeiro obter o token
    const token = await getMarkelToken()
    
    const response = await axios.get(`${baseUrl}/mol/v2/Submission/${submissionId}/QuoteLetter?format=PDF`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error getting Markel quote letter:', error.response?.data || error.message)
    throw new Error(`Markel API Error: ${error.response?.data?.message || error.message}`)
  }
}