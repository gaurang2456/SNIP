import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { ArrowLeft, MousePointerClick, TrendingUp, ExternalLink, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { urlApi } from '../api/urlApi';
import './AnalyticsPage.css';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

function AnalyticsPage() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, urlRes] = await Promise.all([
          urlApi.getAnalytics(id),
          urlApi.getUrlById(id),
        ]);
        setAnalytics(analyticsRes.data.data);
        setUrlData(urlRes.data.data);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCopy = async () => {
    if (!urlData) return;
    try {
      await navigator.clipboard.writeText(urlData.shortUrl);
      setCopied(true);
      toast.success('Copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (loading) {
    return (
      <div className="analytics">
        <div className="container">
          <div className="analytics__loading">
            <div className="skeleton" style={{ height: 24, width: 200, marginBottom: 32 }} />
            <div className="analytics__skeleton-grid">
              {[1, 2].map(i => (
                <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />
              ))}
            </div>
            <div className="skeleton" style={{ height: 280, borderRadius: 12, marginTop: 24 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const refererEntries = Object.entries(analytics.refererStats || {}).slice(0, 6);
  const maxReferer = Math.max(...refererEntries.map(([, v]) => v), 1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="analytics__tooltip">
          <p className="analytics__tooltip-label">{label}</p>
          <p className="analytics__tooltip-value">{payload[0].value} clicks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics">
      <div className="container">
        {/* Back */}
        <Link to="/dashboard" className="analytics__back">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="analytics__header">
          <div className="analytics__header-info">
            <h1 className="analytics__title">
              {urlData?.title || analytics.shortCode}
            </h1>
            <div className="analytics__urls">
              <a
                href={urlData?.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="analytics__short-url"
              >
                {urlData?.shortUrl}
                <ExternalLink size={13} />
              </a>
              <span className="analytics__original-url">{analytics.originalUrl}</span>
            </div>
          </div>
          <button className="analytics__copy-btn" onClick={handleCopy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        {/* Stats */}
        <div className="analytics__stats">
          <div className="analytics__stat-card analytics__stat-card--primary">
            <div className="analytics__stat-icon">
              <MousePointerClick size={22} />
            </div>
            <div>
              <p className="analytics__stat-label">Total clicks</p>
              <p className="analytics__stat-value">{analytics.totalClicks?.toLocaleString()}</p>
            </div>
          </div>
          <div className="analytics__stat-card">
            <div className="analytics__stat-icon analytics__stat-icon--green">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="analytics__stat-label">Last 30 days</p>
              <p className="analytics__stat-value">
                {analytics.dailyClicks?.reduce((s, d) => s + d.count, 0)?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Daily clicks chart */}
        <div className="analytics__card">
          <h2 className="analytics__card-title">Daily clicks (last 30 days)</h2>
          {analytics.dailyClicks && analytics.dailyClicks.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analytics.dailyClicks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#clickGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="analytics__empty">No click data yet</div>
          )}
        </div>

        {/* Referrers */}
        {refererEntries.length > 0 && (
          <div className="analytics__card">
            <h2 className="analytics__card-title">Top referrers</h2>
            <div className="analytics__referrers">
              {refererEntries.map(([referer, count], i) => (
                <div key={referer} className="analytics__referrer-row">
                  <div className="analytics__referrer-info">
                    <span
                      className="analytics__referrer-dot"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="analytics__referrer-name">
                      {referer === 'null' || !referer ? 'Direct / Unknown' : referer}
                    </span>
                  </div>
                  <div className="analytics__referrer-bar-wrap">
                    <div
                      className="analytics__referrer-bar"
                      style={{
                        width: `${(count / maxReferer) * 100}%`,
                        background: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                  <span className="analytics__referrer-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;
