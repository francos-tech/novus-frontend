import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useLazyGetQuoteByIdQuery,
  useSubmitQuoteMutation,
  useLazyGetQuoteHistoryQuery,
} from "@/redux/api/quoteApi";
import { setLastSubmittedQuoteId } from "@/redux/quote/quoteSlice";

export const useQuotes = () => {
  const quote = useSelector((state: RootState) => state.quote);
  const dispatch = useDispatch();
  const [
    submitQuote,
    { isLoading: isSubmittingQuote, error: submitQuoteError },
  ] = useSubmitQuoteMutation();

  const [getQuoteById, { data: selectedQuote, isLoading: isLoadingQuote }] =
    useLazyGetQuoteByIdQuery();

  const [getQuoteHistory, { data: quoteHistory, isLoading: isLoadingQuoteHistory }] =
    useLazyGetQuoteHistoryQuery();

  const clearLastSubmittedQuoteId = () => {
    dispatch(setLastSubmittedQuoteId(null));
  };

  return {
    quote,
    isSubmittingQuote,
    submitQuoteError,
    submitQuote,
    getQuoteById,
    selectedQuote,
    isLoadingQuote,
    getQuoteHistory,
    quoteHistory: quote.quoteHistory,
    isLoadingQuoteHistory,
    lastSubmittedQuoteId: quote.lastSubmittedQuoteId,
    totalQuotes: quote.quoteHistory.length,
    clearLastSubmittedQuoteId,
  };
};
