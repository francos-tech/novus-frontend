export interface QuoteHistoryItem {
  id: string;
  response_data?: GeneralLiabilityQuote;
  created_at?: string;
  policy_type?: string;
}

export interface GeneralLiabilityQuote {
  cnfPolicyService: {
    cnfPolicyHeader: {
      ServiceName: string;
      AgencyReferenceID: string;
      CNFQuoteNumber: string;
      MethodName: string;
      EligibilityStatus: string;
      Status: string;
      Message: string;
      CNFExpressURL: string;
    };
    cnfPolicyData: {
      data: {
        account: {
          Name: string;
          location: {
            IsPrimaryLocation: string;
            Number: string;
            address: {
              Address1: string;
              State: string;
              County: string;
              City: string;
              ZipCode: string;
            };
            TerritoryCode: string;
          };
        };
        policy: {
          EffectiveDate: string;
          ExpirationDate: string;
          QuoteNumber: string;
          PolicyPremium: string;
          line: {
            Type: string;
            Selected: string;
            Deductible: string;
            PolicyPerOccurenceLimit: string;
            PolicyAggregateLimit: string;
            ProductCompletedOperationLimit: string;
            PersonalAdvertisingInjuryLimit: string;
            DamageToPremisesInputLimit: string;
            MedicalLimit: string;
            CoverageForm: string;
            GLPremium: string;
            GLMinimumPremium: string;
            risk: {
              LocationNumber: string;
              Exposure: string;
              RiskState: string;
              GLClassCode: string;
              ClassCategory: string;
              ClassDescription: string;
              Eligibility: string;
              ClassGuidelinePDFPath: string;
              PremiumBasis: string;
              ClassMinPremium: string;
              UnitsDivider: string;
              IsFlatCharge: string;
              BaseRate: string;
              ClassPremium: string;
            } | Array<{
              LocationNumber: string;
              Exposure: string;
              RiskState: string;
              GLClassCode: string;
              ClassCategory: string;
              ClassDescription: string;
              Eligibility: string;
              ClassGuidelinePDFPath: string;
              PremiumBasis: string;
              ClassMinPremium: string;
              UnitsDivider: string;
              IsFlatCharge: string;
              BaseRate: string;
              ClassPremium: string;
            }>;
            optionalCoverages: {
              AdditionalInsured: {
                Form: string;
                NumberOfInsureds: string;
                FormCategory: string;
                PNCSelected: string;
                WOS: string;
                Premium: string;
              };
            };
          };
          CommissionRateandMEP: {
            RetailAgentCommission: string;
            MinimumEarnedPremium: string;
          };
          AuditContactInformation: {
            InsuredAuditContactName: string;
            InsuredAuditContactPrimaryPhone: string;
            InsuredAuditContactemailAddress: string;
            BrokerAuditContactEmailAddress: string;
          };
          AgencyUnderwriter: string;
          Terrorism: string;
          TaxesandFees: {
            StateTax: {
              CalcType: string;
              AmountInput: string;
              Percent: string;
            };
            PolicyFee: {
              CalcType: string;
              AmountInput: string;
              Percent: string;
              StateTaxApplicable: string;
            };
            StampingFee: {
              CalcType: string;
              AmountInput: string;
              Percent: string;
              StateTaxApplicable: string;
            };
          };
          othertaxesuserinterface: Array<{
            Description: string;
            CalcType: string;
            AmountInput: string;
            Percent: string;
            StateTaxApplicable: string;
          }>;
          Referrals: string;
          Prohibited: string;
          FormsList: {
            Form: Array<{
              FormNumber: string;
              FormID: string;
              Name: string;
              AttachCondition: string;
              Category: string;
              URL: string;
            }>;
          };
        };
      };
    };
  };
}

export interface QuoteDetailsProps {
  quoteId: string;
  quote: GeneralLiabilityQuote;
}