import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { logout } from '../auth/authSlice';
import { RootState } from '../store';

// Create a custom base query that handles 401 errors globally
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
    // Get token from state and add to headers if available
    const token = (getState() as RootState).auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  // Check if the response is a 401 Unauthorized
  if (result.error && result.error.status === 401) {
    // Clear the authentication state
    api.dispatch(logout());
  }
  
  return result;
};