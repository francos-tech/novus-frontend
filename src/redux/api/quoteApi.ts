/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from './baseQuery';
import {
  QuoteFormData,
  setSubmitError,
  setSubmitting,
  setSelectedQuote,
  setLoading,
  updateQuoteHistory,
  setLastSubmittedQuoteId,
} from '../quote/quoteSlice';
import { message } from 'antd';
import { GeneralLiabilityQuote, QuoteHistoryItem } from '@/types/general-liability-quote';
import { redirect } from 'next/navigation';

export interface SubmitQuoteRequest {
  quoteData: QuoteFormData;
}

export interface SubmitQuoteResponse {
  id: string;
  quoteNumber: string;
  status: 'submitted' | 'approved' | 'rejected';
  message: string;
  premium?: number;
  totalExposure?: number;
  createdAt: string;
}

export interface UpdateQuoteRequest {
  id: string;
  quoteData: Partial<QuoteFormData>;
}

export interface UpdateQuoteResponse {
  id: string;
  quoteNumber: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  message: string;
  updatedAt: string;
}

// Create the quote API slice
export const quoteApi = createApi({
  reducerPath: 'quoteApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Quote', 'QuoteHistory'],
  endpoints: (builder) => ({
    // Submit a new quote
    submitQuote: builder.mutation<SubmitQuoteResponse, SubmitQuoteRequest>({
      query: (request) => ({
        url: '/quotes/cfins',
        method: 'POST',
        body: {
          method: 'AddNewDCTQuote',
          quoteDetails: {
            cnfPolicyService: {
              cnfPolicyHeader: {
                ServiceName: 'DCTAddOrUpdatePolicy',
                AgencyReferenceID: '',
                CNFQuoteNumber: '',
              },
              cnfPolicyData: {
                data: {
                  ...request.quoteData,
                },
              },
            },
          },
        },
      }),
      invalidatesTags: ['Quote', 'QuoteHistory'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setSubmitting(true));
          const { data } = await queryFulfilled;
          message.open({
            type: 'success',
            content: `Quote submitted successfully! Quote #${data.quoteNumber}`,
          });
          dispatch(setLastSubmittedQuoteId(data.id));
        } catch (error: any) {
          dispatch(
            setSubmitError(
              error?.data?.message ||
                'Failed to submit quote. Please try again.'
            )
          );
          message.open({
            type: 'error',
            content:
              error?.data?.message ||
              'Failed to submit quote. Please try again.',
          });
        } finally {
          dispatch(setSubmitting(false));
        }
      },
    }),

    // Get quote history
    getQuoteHistory: builder.query<
    QuoteHistoryItem[],
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: '/quotes/cfins/history',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
      providesTags: ['QuoteHistory'],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(updateQuoteHistory(data));
          dispatch(setLoading(false));
        } catch (error: any) {
          message.open({
            type: 'error',
            content:
              error?.data?.message ||
              'Failed to update quote. Please try again.',
          });
        }
      },
    }),

    // Get quote by ID
    getQuoteById: builder.query<GeneralLiabilityQuote, string>({
      query: (id) => ({
        url: `/quotes/cfins/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Quote', id }],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setSelectedQuote(data));
          dispatch(setLoading(false));
        } catch (error: any) {
          message.open({
            type: 'error',
            content:
              error?.data?.message ||
              'Failed to update quote. Please try again.',
          });
        }
      },
    }),
    // Update quote
    updateQuote: builder.mutation<UpdateQuoteResponse, UpdateQuoteRequest>({
      query: (request) => ({
        url: `/quotes/${request.id}`,
        method: 'PUT',
        body: request.quoteData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Quote', id },
        'QuoteHistory',
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          message.open({
            type: 'success',
            content: `Quote updated successfully!`,
          });
        } catch (error: any) {
          message.open({
            type: 'error',
            content:
              error?.data?.message ||
              'Failed to update quote. Please try again.',
          });
        }
      },
    }),

    // Delete quote
    deleteQuote: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/quotes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['QuoteHistory'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          message.open({
            type: 'success',
            content: 'Quote deleted successfully!',
          });
        } catch (error: any) {
          message.open({
            type: 'error',
            content:
              error?.data?.message ||
              'Failed to delete quote. Please try again.',
          });
        }
      },
    }),

    // Calculate quote premium (preview)
    calculatePremium: builder.mutation<
      { premium: number; breakdown: any },
      QuoteFormData
    >({
      query: (quoteData) => ({
        url: '/quotes/calculate',
        method: 'POST',
        body: quoteData,
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useSubmitQuoteMutation,
  useGetQuoteHistoryQuery,
  useGetQuoteByIdQuery,
  useLazyGetQuoteByIdQuery,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  useCalculatePremiumMutation,
  useLazyGetQuoteHistoryQuery,
} = quoteApi;
