import { configureStore, combineReducers } from '@reduxjs/toolkit';
import themeReducer, { ThemeState } from './theme/themeSlice';
import authReducer, { AuthState } from './auth/authSlice';
import quoteReducer, { QuoteState } from './quote/quoteSlice';
import { authApi } from './api/authApi';
import { quoteApi } from './api/quoteApi';
import { persistReducer, persistStore, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Define the state shape
interface RootState {
  theme: ThemeState;
  auth: AuthState;
  quote: QuoteState;
  [authApi.reducerPath]: ReturnType<typeof authApi.reducer>;
  [quoteApi.reducerPath]: ReturnType<typeof quoteApi.reducer>;
}

// Combine reducers
const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  quote: quoteReducer,
  [authApi.reducerPath]: authApi.reducer,
  [quoteApi.reducerPath]: quoteApi.reducer,
});

// Persist config with RootState
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, quoteApi.middleware),
});

// Persistor
export const persistor = persistStore(store);

// Type for RootState
export type { RootState };

// Type for AppDispatch
export type AppDispatch = typeof store.dispatch;
