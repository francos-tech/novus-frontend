import { createApi } from '@reduxjs/toolkit/query/react';
import { setToken } from '../auth/authSlice';
import { baseQueryWithAuth } from './baseQuery';
import { message } from 'antd';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
}

// Create the auth API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    signIn: builder.mutation<SignInResponse, SignInRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Transform the response to store token in localStorage
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.access_token));
          message.open({
            type: 'success',
            content: 'Login successful',
          });
        } catch (error) {
          message.open({
            type: 'error',
            content: 'Login failed. Please check your credentials.',
          });
        }
      },
    }),
  }),
});

// Export hooks for use in components
export const {
  useSignInMutation,
} = authApi; 