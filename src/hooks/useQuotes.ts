import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useLazyGetQuoteByIdQuery,
  useSubmitQuoteMutation,
} from "@/redux/api/quoteApi";

export const useQuotes = () => {
  const quote = useSelector((state: RootState) => state.quote);

  const [
    submitQuote,
    { isLoading: isSubmittingQuote, error: submitQuoteError },
  ] = useSubmitQuoteMutation();

  const [getQuoteById, { data: selectedQuote, isLoading: isLoadingQuote }] =
    useLazyGetQuoteByIdQuery();

  return {
    quote,
    isSubmittingQuote,
    submitQuoteError,
    submitQuote,
    getQuoteById,
    selectedQuote,
    isLoadingQuote,
  };
};
