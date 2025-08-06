export { default as quoteReducer } from './quoteSlice';
export type { QuoteState, QuoteFormData } from './quoteSlice';
export {
  setCurrentQuote,
  updateQuoteForm,
  clearCurrentQuote,
  setSubmitting,
  setSubmitError,
  setLastSubmittedQuote,
  addToQuoteHistory,
  updateQuoteHistory,
  clearQuoteHistory,
} from './quoteSlice'; 