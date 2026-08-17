import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { urlApi } from '../api/urlApi';
import { useAuth } from '../context/AuthContext';
import QrCodeModal from '../components/QrCodeModal';

function AnalyticsPage() {
  const { id } = useParams();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [topUrls, setTopUrls] = useState([]);
  const [selectedAnalytics, setSelectedAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('7D');
  const [selectedQrItem, setSelectedQrItem] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const res = await urlApi.getAnalytics(id);
          setSelectedAnalytics(res.data?.data || res.data);
        }

        const topRes = await urlApi.getTopUrls();
        const topList = topRes.data?.data || topRes.data || [];
        setTopUrls(Array.isArray(topList) ? topList : []);
      } catch (err) {
        console.error('Analytics fetch error:', err);
        const msg = err.response?.data?.message || 'Unable to load analytics data from backend.';
        setError(msg);
        setTopUrls([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  if (!isAuthenticated) {
    return (
      <main className="w-full pt-16 bg-surface min-h-screen">
        <div className="max-w-[1200px] mx-auto px-lg py-2xl flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-[480px] bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-2xl shadow-md flex flex-col items-center gap-md">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-xs">
              <span className="material-symbols-outlined text-[32px]">query_stats</span>
            </div>
            <h1 className="font-display text-[26px] text-on-surface font-bold">
              Your analytics are waiting.
            </h1>
            <p className="font-body-md text-on-surface-variant text-sm max-w-[360px] leading-relaxed">
              Create an account to save your links and track their performance over time.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-md w-full mt-md">
              <button
                onClick={() => openAuthModal('login', 'analytics')}
                className="w-full py-md rounded-xl bg-primary text-on-primary font-headline-md text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-[0.99]"
              >
                Sign in
              </button>
              <button
                onClick={() => openAuthModal('register', 'analytics')}
                className="w-full py-md rounded-xl bg-surface border border-outline-variant/30 text-on-surface font-headline-md text-sm font-semibold hover:bg-surface-container transition-all active:scale-[0.99]"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const totalClicks = selectedAnalytics
    ? selectedAnalytics.totalClicks || 0
    : topUrls.reduce((acc, u) => acc + (u.clickCount || 0), 0);

  const dailyClicksList = selectedAnalytics?.dailyClicks || [];
  const hasDailyData = dailyClicksList.length > 0;

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-lg py-xl">
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="mb-2xl flex flex-col items-start gap-xs">
            <h1 className="font-display text-display text-on-surface">Analytics</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[600px]">
              {selectedAnalytics
                ? `Detailed metrics for link snip/${selectedAnalytics.shortCode}`
                : 'Track performance and reach across all your shortened URLs.'}
            </p>
          </div>

          {error && (
            <div className="mb-lg p-md bg-error-container/30 border border-error-container text-on-error-container rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Metric Stat Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl">
            <div className="bg-surface-container rounded-xl p-lg flex flex-col justify-between items-start h-[160px] relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-surface-container-high rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Total Clicks
              </span>
              <div className="flex flex-col">
                <span className="font-display text-[64px] leading-none text-on-surface tracking-[-0.05em] mb-sm">
                  {totalClicks.toLocaleString()}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-on-surface">trending_up</span> Real-time backend total
                </span>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-lg flex flex-col justify-between items-start h-[160px] relative overflow-hidden group">
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span> Total Links
              </span>
              <div className="flex flex-col">
                <span className="font-display text-[64px] leading-none text-on-surface tracking-[-0.05em] mb-sm">
                  {topUrls.length}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-on-surface">link</span> Shortened URLs
                </span>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-lg flex flex-col justify-between items-start h-[160px] relative overflow-hidden group">
              <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-br from-surface-container-highest/50 to-transparent pointer-events-none"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span> Active Links
              </span>
              <div className="flex flex-col">
                <span className="font-display text-[64px] leading-none text-on-surface tracking-[-0.05em] mb-sm">
                  {topUrls.filter((u) => u.isActive !== false && !u.expired).length}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-on-surface">check_circle</span> Active status
                </span>
              </div>
            </div>
          </section>

          {/* Click Activity Chart */}
          <section className="bg-surface-container rounded-xl p-xl flex flex-col mb-2xl relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-surface-container-highest/20 to-transparent pointer-events-none"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-xl relative z-10 gap-md">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Click Activity</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Daily click volume tracked by the backend API.</p>
              </div>
              <div className="flex items-center gap-sm bg-surface rounded-full p-1 shadow-sm">
                {['7D', '30D', 'YTD'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-md py-sm font-label-sm text-label-sm rounded-full transition-colors ${
                      period === p
                        ? 'bg-primary text-on-primary font-medium'
                        : 'text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full min-h-[220px] flex items-center justify-center relative z-10">
              {hasDailyData ? (
                <svg className="w-full h-[260px] overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 260">
                  <g className="text-on-surface" stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.1">
                    <line x1="0" x2="800" y1="50" y2="50"></line>
                    <line x1="0" x2="800" y1="125" y2="125"></line>
                    <line x1="0" x2="800" y1="200" y2="200"></line>
                  </g>
                  <path
                    d="M0,200 L800,200"
                    fill="none"
                    stroke="#1b1b1b"
                    strokeWidth="2"
                  ></path>
                </svg>
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-xs py-xl text-on-surface-variant">
                  <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40">show_chart</span>
                  <h4 className="font-headline-md text-body-md text-on-surface">No click activity recorded yet</h4>
                  <p className="text-sm max-w-[360px]">
                    Analytics and daily click trends will automatically display here as soon as your links receive traffic.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Top Performing URLs Section */}
          <section className="mb-2xl">
            <div className="flex justify-between items-end mb-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface">Top Performing URLs</h3>
              <Link
                to="/urls"
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1"
              >
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="flex flex-col gap-sm">
              {loading ? (
                <div className="p-xl text-center text-on-surface-variant">Loading top URLs...</div>
              ) : topUrls.length === 0 ? (
                <div className="p-2xl bg-surface rounded-lg text-center text-on-surface-variant border border-outline-variant/10">
                  <p className="font-body-md text-on-surface">No links found.</p>
                  <p className="text-sm mt-xs">Create shortened URLs to view performance stats here.</p>
                </div>
              ) : (
                topUrls.map((item) => {
                  const shortUrl = item.shortUrl || `${window.location.origin}/${item.shortCode}`;
                  return (
                    <div
                      key={item.id}
                      className="bg-surface rounded-lg p-md flex items-center justify-between group hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/10"
                    >
                      <div className="flex items-center gap-md min-w-0">
                        <div className="w-10 h-10 rounded-md bg-surface-container-highest flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                          <span className="material-symbols-outlined">link</span>
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono-url text-mono-url text-on-surface font-bold truncate hover:underline"
                          >
                            {item.shortCode ? `snip/${item.shortCode}` : shortUrl}
                          </a>
                          <span className="font-body-md text-[13px] text-on-surface-variant truncate">
                            {item.originalUrl}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-lg ml-md shrink-0">
                        <div className="flex flex-col items-end">
                          <span className="font-headline-md text-[18px] text-on-surface leading-none font-semibold">
                            {item.clickCount != null ? item.clickCount.toLocaleString() : 0}
                          </span>
                          <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Clicks</span>
                        </div>
                        <button
                          onClick={() => handleCopy(shortUrl)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-variant text-on-surface-variant transition-colors"
                          title="Copy link"
                        >
                          <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={Boolean(selectedQrItem)}
        onClose={() => setSelectedQrItem(null)}
        urlItem={selectedQrItem}
      />
    </main>
  );
}

export default AnalyticsPage;
