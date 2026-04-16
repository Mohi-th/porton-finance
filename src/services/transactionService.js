// ─── Service wrapper for API ───
import { api } from './api';

export const getAllTransactions = async () => {
  return api.getTransactions();
};

export const createTransaction = async (txData) => {
  return api.createTransaction(txData);
};

export const updateTransaction = async (id, txData) => {
  return api.updateTransaction(id, txData);
};

export const deleteTransaction = async (id) => {
  return api.deleteTransaction(id);
};
