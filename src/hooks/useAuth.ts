import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSignInMutation } from '@/redux/api/authApi';
import { logout as logoutAction } from '@/redux/auth/authSlice';
import { RootState } from '@/redux/store';
import { SignInRequest } from '@/redux/api/authApi';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  
  const [signIn, { isLoading: isSigningIn, error: signInError }] = useSignInMutation();

  const login = useCallback(async (credentials: SignInRequest) => {
    try {
      await signIn(credentials);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [signIn]);

  const logout = useCallback(async () => {
    dispatch(logoutAction());
  }, [dispatch]);

  return {
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: isSigningIn,
    signInError,
    login,
    logout,
  };
}; 