import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GeneralLiabilityQuote, QuoteHistoryItem } from '@/types/general-liability-quote';

export interface QuoteFormData {
  account: {
    Name: string;
    location: Array<{
      Number: string;
      IsPrimaryLocation: string;
      Address1: string;
      ZipCode: string;
    }>;
  };
  policy: {
    EffectiveDate: string;
    ExpirationDate: string;
    line: {
      Type: string;
      Deductible: string;
      PolicyPerOccurenceLimit: string;
      PolicyAggregateLimit: string;
      CoverageForm: string;
      risk: Array<{
        LocationNumber: string;
        GLClassCode: string;
        Exposure: string;
      }>;
      optionalCoverages: {
        WithPrimaryOrNonContributoryWording: string;
        AdditionalInsured: Array<{
          Form: string;
          NumberOfInsureds: string;
          WOS: string;
        }>;
      };
    };
  };
}

export interface QuoteState {
  currentQuote: QuoteFormData | null;
  quoteHistory: QuoteHistoryItem[];
  selectedQuote: GeneralLiabilityQuote | null;
  isLoading: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  lastSubmittedQuoteId: string | null;
  lastSubmittedQuote: QuoteFormData | null;
}

const initialState: QuoteState = {
  currentQuote: null,
  quoteHistory: [],
  selectedQuote: null,
  isLoading: false,
  isSubmitting: false,
  submitError: null,
  lastSubmittedQuoteId: null,
  lastSubmittedQuote: null,
};

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setCurrentQuote: (state, action: PayloadAction<QuoteFormData>) => {
      state.currentQuote = action.payload;
      state.submitError = null;
    },
    updateQuoteForm: (state, action: PayloadAction<Partial<QuoteFormData>>) => {
      if (state.currentQuote) {
        state.currentQuote = { ...state.currentQuote, ...action.payload };
      }
    },
    clearCurrentQuote: (state) => {
      state.currentQuote = null;
      state.submitError = null;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setSubmitError: (state, action: PayloadAction<string | null>) => {
      state.submitError = action.payload;
    },
    setLastSubmittedQuote: (state, action: PayloadAction<QuoteFormData>) => {
      state.lastSubmittedQuote = action.payload;
    },
    setLastSubmittedQuoteId: (state, action: PayloadAction<string | null>) => {
      state.lastSubmittedQuoteId = action.payload;
    },
    addToQuoteHistory: (state, action: PayloadAction<QuoteHistoryItem>) => {
      state.quoteHistory.unshift(action.payload);
    },
    updateQuoteHistory: (state, action: PayloadAction<QuoteHistoryItem[]>) => {
      state.quoteHistory = action.payload;
    },
    clearQuoteHistory: (state) => {
      state.quoteHistory = [];
    },
    setSelectedQuote: (state, action: PayloadAction<GeneralLiabilityQuote>) => {
      state.selectedQuote = action.payload;
    },
    clearSelectedQuote: (state) => {
      state.selectedQuote = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCurrentQuote,
  updateQuoteForm,
  clearCurrentQuote,
  setSubmitting,
  setSubmitError,
  setLastSubmittedQuote,
  addToQuoteHistory,
  updateQuoteHistory,
  clearQuoteHistory,
  setSelectedQuote,
  clearSelectedQuote,
  setLoading,
  setLastSubmittedQuoteId,
} = quoteSlice.actions;

export default quoteSlice.reducer; 