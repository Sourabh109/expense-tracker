import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import toast from 'react-hot-toast';

const CATEGORY_EMOJI = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '💡',
  Health: '❤️', Salary: '💼', Freelance: '💻', Entertainment: '🎬',
  Education: '📚', Other: '📌',
};

export default function TransactionRow({ transaction, showActions = true }) {
  const { removeTransaction } = useTransactions();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await removeTransaction(transaction._id);
      toast.success('Transaction deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const fmtAmount = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="txn-row">
      <div className={`txn-icon ${transaction.type}`}>
        {CATEGORY_EMOJI[transaction.category] || '📌'}
      </div>
      <div className="txn-info">
        <div className="txn-desc">{transaction.description}</div>
        <div className="txn-meta">
          <span className={`badge badge-${transaction.type}`}>{transaction.type}</span>
          {' '}<span className="badge badge-cat">{transaction.category}</span>
          {' '}· {fmtDate(transaction.date)}
        </div>
      </div>
      <div className={`txn-amount ${transaction.type}`}>
        {transaction.type === 'income' ? '+' : '-'}{fmtAmount(transaction.amount)}
      </div>
      {showActions && (
        <div className="txn-actions">
          <button className="btn btn-icon btn-sm" onClick={() => navigate(`/edit/${transaction._id}`)} title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button className="btn btn-icon btn-sm btn-danger" onClick={handleDelete} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
