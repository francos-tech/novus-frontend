import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration - in production, this would fetch from your database
const mockQuoteData = {
  "cnfPolicyService": {
    "cnfPolicyHeader": {
      "ServiceName": "DCTAddOrUpdatePolicy",
      "AgencyReferenceID": "",
      "CNFQuoteNumber": "CP1308206Q2025.01",
      "MethodName": "AddNewDCTQuote",
      "EligibilityStatus": "Authority",
      "Status": "success",
      "Message": "",
      "CNFExpressURL": "https://dctuat-fed.cfins.com/proxy1.aspx?_QuoteID=1294618&_submitAction=load"
    },
    "cnfPolicyData": {
      "data": {
        "account": {
          "Name": "Daniel Franco",
          "location": {
            "IsPrimaryLocation": "1",
            "Number": "1",
            "address": {
              "Address1": "Rua João Gomes da Nobrega, 350",
              "State": "NV",
              "County": "Clark County",
              "City": "College Park",
              "ZipCode": "89032"
            },
            "TerritoryCode": "001"
          }
        },
        "policy": {
          "EffectiveDate": "2025-08-05",
          "ExpirationDate": "2026-08-05",
          "QuoteNumber": "CP1308206Q2025.01",
          "PolicyPremium": "495",
          "line": {
            "Type": "GeneralLiability",
            "Selected": "1",
            "Deductible": "N/A",
            "PolicyPerOccurenceLimit": "1000000",
            "PolicyAggregateLimit": "2000000",
            "ProductCompletedOperationLimit": "2000000",
            "PersonalAdvertisingInjuryLimit": "1000000",
            "DamageToPremisesInputLimit": "100000",
            "MedicalLimit": "5000",
            "CoverageForm": "OCCURRENCE",
            "GLPremium": "495",
            "GLMinimumPremium": "495",
            "risk": {
              "LocationNumber": "1",
              "Exposure": "15000",
              "RiskState": "NV",
              "GLClassCode": "10010",
              "ClassCategory": "Distributor",
              "ClassDescription": "Air Conditioning Equipment - dealers or distributors only",
              "Eligibility": "Authority",
              "ClassGuidelinePDFPath": "Distributors_10010_000_000.pdf",
              "PremiumBasis": "Sales",
              "ClassMinPremium": "0",
              "UnitsDivider": "1000",
              "IsFlatCharge": "0",
              "BaseRate": "2.45",
              "ClassPremium": "37"
            },
            "optionalCoverages": {
              "AdditionalInsured": {
                "Form": "CG2011",
                "NumberOfInsureds": "4",
                "FormCategory": "Blanket",
                "PNCSelected": "1",
                "WOS": "4",
                "Premium": "0"
              }
            }
          },
          "CommissionRateandMEP": {
            "RetailAgentCommission": "",
            "MinimumEarnedPremium": "25"
          },
          "AuditContactInformation": {
            "InsuredAuditContactName": "",
            "InsuredAuditContactPrimaryPhone": "",
            "InsuredAuditContactemailAddress": "",
            "BrokerAuditContactEmailAddress": ""
          },
          "AgencyUnderwriter": "",
          "Terrorism": "-1",
          "TaxesandFees": {
            "StateTax": {
              "CalcType": "Percent",
              "AmountInput": "",
              "Percent": "0"
            },
            "PolicyFee": {
              "CalcType": "Amount",
              "AmountInput": "0",
              "Percent": "0",
              "StateTaxApplicable": "0"
            },
            "StampingFee": {
              "CalcType": "Amount",
              "AmountInput": "0",
              "Percent": "0",
              "StateTaxApplicable": "1"
            }
          },
          "othertaxesuserinterface": [
            {
              "Description": "",
              "CalcType": "Amount",
              "AmountInput": "0",
              "Percent": "0",
              "StateTaxApplicable": "1"
            },
            {
              "Description": "",
              "CalcType": "Amount",
              "AmountInput": "0",
              "Percent": "0",
              "StateTaxApplicable": "1"
            },
            {
              "Description": "",
              "CalcType": "Amount",
              "AmountInput": "0",
              "Percent": "0",
              "StateTaxApplicable": "1"
            },
            {
              "Description": "",
              "CalcType": "Amount",
              "AmountInput": "0",
              "Percent": "0",
              "StateTaxApplicable": "1"
            }
          ],
          "Referrals": "",
          "Prohibited": "",
          "FormsList": {
            "Form": [
              {
                "FormNumber": "ILP001 01/04",
                "FormID": "ILP0010104",
                "Name": "U.S. Treasury Department's Office of Foreign Assets Control (\"OFAC\") Advisory Notice to Policyholders",
                "AttachCondition": "Mandatory",
                "Category": "State Notices and Disclosures",
                "URL": "https://policy-uat.cfins.io/api/formUrlRedirect?key=ILP0010104.pdf"
              },
              {
                "FormNumber": "SB050 04/23",
                "FormID": "SB0500423",
                "Name": "Common Policy Declarations",
                "AttachCondition": "Mandatory",
                "Category": "Common Policy Declarations",
                "URL": "https://policy-uat.cfins.io/api/formUrlRedirect?key=SB0500423.pdf"
              },
              {
                "FormNumber": "CG0001 12/07",
                "FormID": "CG00011207",
                "Name": "Commercial General Liability Coverage Form",
                "AttachCondition": "Mandatory",
                "Category": "General Liability Coverage",
                "URL": "https://policy-uat.cfins.io/api/formUrlRedirect?key=CG00011207.pdf"
              },
              {
                "FormNumber": "SB022 01/24",
                "FormID": "SB0220124",
                "Name": "Hazardous Materials Exclusion",
                "AttachCondition": "Selected",
                "Category": "General Liability Coverage",
                "URL": "https://policy-uat.cfins.io/api/formUrlRedirect?key=SB0220124.pdf"
              },
              {
                "FormNumber": "CG2011 12/19",
                "FormID": "CG20111219",
                "Name": "Additional Insured Managers or Lessors of Premises",
                "AttachCondition": "Mandatory",
                "Category": "General Liability Coverage",
                "URL": "https://policy-uat.cfins.io/api/formUrlRedirect?key=CG20111219.pdf"
              }
            ]
          }
        }
      }
    }
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id;

    // In production, you would fetch the actual quote data from your database
    // For now, we'll return the mock data for any ID
    // const quote = await fetchQuoteFromDatabase(quoteId);
    
    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    // Simulate a database lookup delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: mockQuoteData,
      quoteId
    });

  } catch (error) {
    console.error('Error fetching quote details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote details' },
      { status: 500 }
    );
  }
}