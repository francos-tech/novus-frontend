export { default as quoteReducer } from './quoteSlice';
export type { QuoteState, QuoteFormData, QuoteHistoryItem } from './quoteSlice';
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