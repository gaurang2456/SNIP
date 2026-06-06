import React, { useState, useEffect, useCallback } from 'react';
import { Link2, TrendingUp, MousePointerClick, RefreshCw, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { urlApi } from '../api/urlApi';
import ShortenForm from '../components/ShortenForm';
import UrlTable from '../components/UrlTable';
import ResultCard from '../components/ResultCard';
import './DashboardPage.css';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ background: `${color}15`, color }}>
        <Icon size={20} />
      </div>
      <div>
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await urlApi.getAllUrls();
      setUrls(res.data.data || []);
    } catch {
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleSuccess = (url) => {
    setNewUrl(url);
    setShowForm(false);
    fetchUrls();
  };

  const handleDelete = (id) => {
    setUrls(prev => prev.filter(u => u.id !== id));
  };

  const totalClicks = urls.reduce((sum, u) => sum + (u.clickCount || 0), 0);
  const activeLinks = urls.filter(u => u.isActive && !u.expired).length;

  const filtered = urls.filter(u =>
    !search ||
    u.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
    u.shortCode.toLowerCase().includes(search.toLowerCase()) ||
    (u.title && u.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Dashboard</h1>
            <p className="dashboard__sub">Manage and track all your shortened links</p>
          </div>
          <div className="dashboard__header-actions">
            <button className="dashboard__refresh-btn" onClick={fetchUrls} title="Refresh">
              <RefreshCw size={16} />
            </button>
            <button
              className="dashboard__create-btn"
              onClick={() => { setShowForm(!showForm); setNewUrl(null); }}
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? 'Cancel' : 'New link'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard__stats">
          <StatCard icon={Link2} label="Total links" value={urls.length} color="#6366f1" />
          <StatCard icon={MousePointerClick} label="Total clicks" value={totalClicks.toLocaleString()} color="#06b6d4" />
          <StatCard icon={TrendingUp} label="Active links" value={activeLinks} color="#10b981" />
        </div>

        {/* Create form */}
        {showForm && (
          <div className="dashboard__form-wrap fade-in">
            <ShortenForm onSuccess={handleSuccess} />
          </div>
        )}

        {/* New URL result */}
        {newUrl && (
          <div className="dashboard__new-result fade-in">
            <ResultCard url={newUrl} onDismiss={() => setNewUrl(null)} />
          </div>
        )}

        {/* Table */}
        <div className="dashboard__table-section">
          <div className="dashboard__table-header">
            <h2 className="dashboard__table-title">Your links</h2>
            <input
              type="search"
              placeholder="Search links..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="dashboard__search"
            />
          </div>
          <UrlTable urls={filtered} onDelete={handleDelete} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
