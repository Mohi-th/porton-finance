import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/transactionSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
});

export default store;
