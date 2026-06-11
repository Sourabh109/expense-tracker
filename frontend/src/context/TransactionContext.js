import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getTransactions,
  getSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../utils/api';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await getTransactions(params);
      setTransactions(data.data);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await getSummary();
      setSummary(data.data);
    } catch (err) {
      console.error('Failed to fetch summary', err);
    }
  }, []);

  const addTransaction = async (txnData) => {
    const { data } = await createTransaction(txnData);
    setTransactions((prev) => [data.data, ...prev]);
    fetchSummary();
    return data.data;
  };

  const editTransaction = async (id, txnData) => {
    const { data } = await updateTransaction(id, txnData);
    setTransactions((prev) => prev.map((t) => (t._id === id ? data.data : t)));
    fetchSummary();
    return data.data;
  };

  const removeTransaction = async (id) => {
    await deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    fetchSummary();
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        summary,
        loading,
        pagination,
        fetchTransactions,
        fetchSummary,
        addTransaction,
        editTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be inside TransactionProvider');
  return ctx;
};
