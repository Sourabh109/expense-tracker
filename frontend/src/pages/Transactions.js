import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import TransactionRow from '../components/TransactionRow';

const CATEGORIES = ['Food','Transport','Shopping','Bills','Health','Salary','Freelance','Entertainment','Education','Other'];

export default function Transactions() {
  const { transactions, pagination, loading, fetchTransactions } = useTransactions();
  const [filters, setFilters] = useState({ type: '', category: '', search: '', page: 1 });

  const load = useCallback(() => {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    params.page = filters.page;
    params.limit = 15;
    fetchTransactions(params);
  }, [filters, fetchTransactions]);

  useEffect(() => { load(); }, [load]);

  const setFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val, page: 1 }));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <Link to="/add" className="btn btn-primary">+ Add transaction</Link>
      </div>

      <div className="filters">
        <select className="form-control" value={filters.type} onChange={(e) => setFilter('type', e.target.value)}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="form-control" value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          className="form-control"
          style={{ flex: 1, minWidth: 160 }}
          type="text"
          placeholder="Search description..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
        />
        {(filters.type || filters.category || filters.search) && (
          <button className="btn btn-sm" onClick={() => setFilters({ type: '', category: '', search: '', page: 1 })}>
            Clear
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : transactions.length ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {pagination.total} transaction{pagination.total !== 1 ? 's' : ''}
            </p>
            {transactions.map((t) => <TransactionRow key={t._id} transaction={t} />)}
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1rem' }}>
                <button className="btn btn-sm" disabled={filters.page <= 1} onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}>
                  ← Prev
                </button>
                <span style={{ padding: '5px 10px', fontSize: 13, color: 'var(--text-muted)' }}>
                  {filters.page} / {pagination.pages}
                </span>
                <button className="btn btn-sm" disabled={filters.page >= pagination.pages} onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}>
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No transactions found. <Link to="/add">Add one →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
