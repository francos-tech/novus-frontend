import React from 'react';
import { Card, Badge, Button, Separator } from '../ui';
import { GeneralLiabilityQuote } from '../../types/general-liability-quote';

interface GeneralLiabilityQuoteDetailsProps {
  quote: GeneralLiabilityQuote;
  quoteId: string;
}

export function GeneralLiabilityQuoteDetails({ quote, quoteId }: GeneralLiabilityQuoteDetailsProps) {
  const { cnfPolicyHeader, cnfPolicyData } = quote.cnfPolicyService;
  const { account, policy } = cnfPolicyData.data;

  const formatCurrency = (amount: string) => {
    if (!amount || amount === '0') return 'N/A';
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'authority': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupFormsByCategory = (forms: any[]) => {
    return forms.reduce((acc, form) => {
      if (!acc[form.Category]) {
        acc[form.Category] = [];
      }
      acc[form.Category].push(form);
      return acc;
    }, {} as Record<string, any[]>);
  };

  const groupedForms = groupFormsByCategory(policy.FormsList.Form);

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">General Liability Quote</h1>
            <p className="text-xl text-gray-600 mt-2">{account.Name}</p>
            <p className="text-sm text-gray-500">Quote #{cnfPolicyHeader.CNFQuoteNumber}</p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(cnfPolicyHeader.Status)}>
              {cnfPolicyHeader.Status.toUpperCase()}
            </Badge>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {formatCurrency(policy.PolicyPremium)}
            </p>
            <p className="text-sm text-gray-500">Annual Premium</p>
          </div>
        </div>
        
        {cnfPolicyHeader.CNFExpressURL && (
          <Button 
            onClick={() => window.open(cnfPolicyHeader.CNFExpressURL, '_blank')}
            className="mt-4"
          >
            🔗 Open in CNF Express
          </Button>
        )}
      </Card>

      {/* Account Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          👤 Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Insured Name</h3>
            <p className="text-gray-900">{account.Name}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Location Address</h3>
            <div className="text-gray-900">
              <p>{account.location.address.Address1}</p>
              <p>{account.location.address.City}, {account.location.address.State} {account.location.address.ZipCode}</p>
              <p className="text-sm text-gray-600">{account.location.address.County}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Territory Code</h3>
            <p className="text-gray-900">{account.location.TerritoryCode}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Location Details</h3>
            <p className="text-gray-900">
              Location #{account.location.Number} 
              {account.location.IsPrimaryLocation === '1' && ' (Primary)'}
            </p>
          </div>
        </div>
      </Card>

      {/* Policy Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          📋 Policy Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Policy Period</h3>
            <p className="text-gray-900">{formatDate(policy.EffectiveDate)}</p>
            <p className="text-gray-600 text-sm">to {formatDate(policy.ExpirationDate)}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Coverage Type</h3>
            <p className="text-gray-900">{policy.line.Type}</p>
            <p className="text-sm text-gray-600">{policy.line.CoverageForm} Form</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Deductible</h3>
            <p className="text-gray-900">{policy.line.Deductible}</p>
          </div>
        </div>
      </Card>

      {/* Coverage Limits */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          🛡️ Coverage Limits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Per Occurrence Limit</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(policy.line.PolicyPerOccurenceLimit)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">General Aggregate</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(policy.line.PolicyAggregateLimit)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Products/Completed Operations</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(policy.line.ProductCompletedOperationLimit)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Personal & Advertising Injury</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(policy.line.PersonalAdvertisingInjuryLimit)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Damage to Premises</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(policy.line.DamageToPremisesInputLimit)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Medical Expense</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(policy.line.MedicalLimit)}
            </p>
          </div>
        </div>
      </Card>

      {/* Risk Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          ⚠️ Risk Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Business Classification</h3>
            <div className="space-y-2">
              <p className="text-gray-900 font-medium">
                {policy.line.risk.ClassDescription}
              </p>
              <p className="text-sm text-gray-600">
                Class Code: {policy.line.risk.GLClassCode} - {policy.line.risk.ClassCategory}
              </p>
              <Badge className={getStatusColor(policy.line.risk.Eligibility)}>
                {policy.line.risk.Eligibility}
              </Badge>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Premium Calculation</h3>
            <div className="space-y-2">
              <p className="text-gray-900">
                Exposure: {formatCurrency(policy.line.risk.Exposure)} ({policy.line.risk.PremiumBasis})
              </p>
              <p className="text-gray-600">Base Rate: {policy.line.risk.BaseRate}%</p>
              <p className="text-gray-600">Class Premium: {formatCurrency(policy.line.risk.ClassPremium)}</p>
              <p className="text-gray-600">Units Divider: {policy.line.risk.UnitsDivider}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Premium Breakdown */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          💰 Premium Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">GL Premium</h3>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(policy.line.GLPremium)}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Minimum Premium</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(policy.line.GLMinimumPremium)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Min Earned Premium</h3>
            <p className="text-xl font-bold text-purple-600">
              {formatCurrency(policy.CommissionRateandMEP.MinimumEarnedPremium)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Total Premium</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(policy.PolicyPremium)}
            </p>
          </div>
        </div>
      </Card>

      {/* Optional Coverages */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          ➕ Optional Coverages
        </h2>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Additional Insured</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Form:</span>
              <p className="font-medium">{policy.line.optionalCoverages.AdditionalInsured.Form}</p>
            </div>
            <div>
              <span className="text-gray-600">Number of Insureds:</span>
              <p className="font-medium">{policy.line.optionalCoverages.AdditionalInsured.NumberOfInsureds}</p>
            </div>
            <div>
              <span className="text-gray-600">Category:</span>
              <p className="font-medium">{policy.line.optionalCoverages.AdditionalInsured.FormCategory}</p>
            </div>
            <div>
              <span className="text-gray-600">Premium:</span>
              <p className="font-medium">{formatCurrency(policy.line.optionalCoverages.AdditionalInsured.Premium)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Forms and Endorsements */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          📄 Forms and Endorsements
        </h2>
        <div className="space-y-6">
          {Object.entries(groupedForms).map(([category, forms]) => (
            <div key={category}>
              <h3 className="text-lg font-medium text-gray-800 mb-3 border-b pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {forms.map((form, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono bg-white px-2 py-1 rounded">
                          {form.FormNumber}
                        </span>
                        <Badge 
                          className={
                            form.AttachCondition === 'Mandatory' ? 'bg-red-100 text-red-800' :
                            form.AttachCondition === 'Selected' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {form.AttachCondition}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{form.Name}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(form.URL, '_blank')}
                      className="ml-4"
                    >
                      📄 View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Taxes and Fees */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          🧾 Taxes and Fees
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">State Tax</h3>
            <p className="text-gray-900">
              {policy.TaxesandFees.StateTax.Percent}% ({policy.TaxesandFees.StateTax.CalcType})
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Policy Fee</h3>
            <p className="text-gray-900">
              {formatCurrency(policy.TaxesandFees.PolicyFee.AmountInput)} ({policy.TaxesandFees.PolicyFee.CalcType})
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Stamping Fee</h3>
            <p className="text-gray-900">
              {formatCurrency(policy.TaxesandFees.StampingFee.AmountInput)} ({policy.TaxesandFees.StampingFee.CalcType})
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <Button variant="default">
            📋 Bind Policy
          </Button>
          <Button variant="outline">
            📊 Compare Quotes
          </Button>
          <Button variant="outline">
            📧 Email Quote
          </Button>
          <Button variant="outline">
            🖨️ Print Quote
          </Button>
          <Button variant="outline">
            📝 Edit Quote
          </Button>
        </div>
      </Card>
    </div>
  );
}