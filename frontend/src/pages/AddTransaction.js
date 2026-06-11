import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { getTransaction } from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Food','Transport','Shopping','Bills','Health','Salary','Freelance','Entertainment','Education','Other'];

const today = () => new Date().toISOString().split('T')[0];

export default function AddTransaction() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addTransaction, editTransaction } = useTransactions();

  const [form, setForm] = useState({
    type: 'expense', description: '', amount: '', category: 'Food', date: today(), notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      getTransaction(id)
        .then(({ data }) => {
          const t = data.data;
          setForm({
            type: t.type,
            description: t.description,
            amount: String(t.amount),
            category: t.category,
            date: t.date.split('T')[0],
            notes: t.notes || '',
          });
        })
        .catch(() => { toast.error('Transaction not found'); navigate('/transactions'); })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (isEdit) {
        await editTransaction(id, payload);
        toast.success('Transaction updated');
      } else {
        await addTransaction(payload);
        toast.success('Transaction added');
      }
      navigate('/transactions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  if (fetching) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit transaction' : 'Add transaction'}</h1>
        <button className="btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit}>
          {/* Type toggle */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button type="button" className={`type-btn${form.type === 'income' ? ' selected-income' : ''}`} onClick={() => setForm((p) => ({ ...p, type: 'income' }))}>
                ↓ Income
              </button>
              <button type="button" className={`type-btn${form.type === 'expense' ? ' selected-expense' : ''}`} onClick={() => setForm((p) => ({ ...p, type: 'expense' }))}>
                ↑ Expense
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input className={`form-control${errors.description ? ' error' : ''}`} type="text" value={form.description} onChange={set('description')} placeholder="e.g. Grocery shopping" maxLength={100} />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input className={`form-control${errors.amount ? ' error' : ''}`} type="number" value={form.amount} onChange={set('amount')} placeholder="0" min="0.01" step="0.01" />
              {errors.amount && <p className="form-error">{errors.amount}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className={`form-control${errors.date ? ' error' : ''}`} type="date" value={form.date} onChange={set('date')} />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea className="form-control" value={form.notes} onChange={set('notes')} placeholder="Any additional notes..." rows={2} maxLength={300} style={{ resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save changes' : 'Add transaction')}
            </button>
            <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
