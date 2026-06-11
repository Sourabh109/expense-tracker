import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend, Title,
} from 'chart.js';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import TransactionRow from '../components/TransactionRow';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export default function Dashboard() {
  const { user } = useAuth();
  const { summary, transactions, fetchSummary, fetchTransactions, loading } = useTransactions();

  useEffect(() => {
    fetchSummary();
    fetchTransactions({ limit: 5 });
  }, [fetchSummary, fetchTransactions]);

  // Build monthly bar chart data
  const monthlyData = (() => {
    if (!summary?.monthly) return null;
    const map = {};
    summary.monthly.forEach(({ _id, total }) => {
      const key = `${_id.year}-${String(_id.month).padStart(2, '0')}`;
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      map[key][_id.type] = total;
    });
    const labels = Object.keys(map).sort().slice(-6).map((k) => {
      const [y, m] = k.split('-');
      return new Date(y, m - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
    });
    const keys = Object.keys(map).sort().slice(-6);
    return {
      labels,
      datasets: [
        { label: 'Income', data: keys.map((k) => map[k].income), backgroundColor: '#C0DD97', borderColor: '#639922', borderWidth: 1, borderRadius: 4 },
        { label: 'Expenses', data: keys.map((k) => map[k].expense), backgroundColor: '#F7C1C1', borderColor: '#E24B4A', borderWidth: 1, borderRadius: 4 },
      ],
    };
  })();

  // Category doughnut
  const categoryData = (() => {
    if (!summary?.byCategory?.length) return null;
    const top = summary.byCategory.slice(0, 6);
    return {
      labels: top.map((c) => c._id),
      datasets: [{
        data: top.map((c) => c.total),
        backgroundColor: ['#B5D4F4','#9FE1CB','#F5C4B3','#FAC775','#F4C0D1','#C0DD97'],
        borderWidth: 0,
      }],
    };
  })();

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { font: { size: 12 }, boxWidth: 12 } } },
    scales: {
      y: { ticks: { callback: (v) => '₹' + v.toLocaleString('en-IN'), font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { ticks: { font: { size: 11 } }, grid: { display: false } },
    },
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>Here's your financial overview</p>
        </div>
        <Link to="/add" className="btn btn-primary">+ Add transaction</Link>
      </div>

      {/* Stats */}
      <div className="grid-4">
        <div className="card">
          <p className="card-title">Balance</p>
          <p className="stat-value" style={{ color: (summary?.balance || 0) >= 0 ? '#27500A' : '#A32D2D' }}>
            {fmt(summary?.balance)}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Total income</p>
          <p className="stat-value" style={{ color: '#27500A' }}>{fmt(summary?.totalIncome)}</p>
        </div>
        <div className="card">
          <p className="card-title">Total expenses</p>
          <p className="stat-value" style={{ color: '#A32D2D' }}>{fmt(summary?.totalExpense)}</p>
        </div>
        <div className="card">
          <p className="card-title">Transactions</p>
          <p className="stat-value">{summary?.totalTransactions || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        <div className="card">
          <p className="card-title" style={{ marginBottom: '1rem' }}>Income vs expenses (monthly)</p>
          <div className="chart-wrap">
            {monthlyData ? <Bar data={monthlyData} options={chartOptions} /> : <p style={{ color: 'var(--text-muted)', fontSize: 14, paddingTop: '4rem', textAlign: 'center' }}>No data yet</p>}
          </div>
        </div>
        <div className="card">
          <p className="card-title" style={{ marginBottom: '1rem' }}>Expenses by category</p>
          <div className="chart-wrap">
            {categoryData
              ? <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { size: 12 }, boxWidth: 12 } } } }} />
              : <p style={{ color: 'var(--text-muted)', fontSize: 14, paddingTop: '4rem', textAlign: 'center' }}>No expense data yet</p>}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <p className="card-title" style={{ marginBottom: 0 }}>Recent transactions</p>
          <Link to="/transactions" className="btn btn-sm">View all</Link>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : transactions.length ? (
          transactions.map((t) => <TransactionRow key={t._id} transaction={t} showActions={false} />)
        ) : (
          <div className="empty-state">
            <p>No transactions yet. <Link to="/add">Add your first one →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
