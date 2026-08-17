import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { urlApi } from '../api/urlApi';
import { useAuth } from '../context/AuthContext';
import ShortenForm from '../components/ShortenForm';
import QrCodeModal from '../components/QrCodeModal';

function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedQrItem, setSelectedQrItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchUrls = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await urlApi.getAllUrls();
      const list = res.data?.data || res.data || [];
      setUrls(Array.isArray(list) ? list : []);
    } catch {
      setError('Unable to load links from backend.');
      setUrls([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await urlApi.deleteUrl(id);
      toast.success('Link deleted successfully');
      setUrls((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      toast.error('Failed to delete link');
    }
  };

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
              <span className="material-symbols-outlined text-[32px]">bookmark</span>
            </div>
            <h1 className="font-display text-[26px] text-on-surface font-bold">Track your links</h1>
            <p className="font-body-md text-on-surface-variant text-sm max-w-[360px] leading-relaxed">
              Sign in to save your links and view click analytics across your URLs.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-md w-full mt-md">
              <button
                onClick={() => openAuthModal('login', 'urls')}
                className="w-full py-md rounded-xl bg-primary text-on-primary font-headline-md text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-[0.99]"
              >
                Sign in
              </button>
              <button
                onClick={() => openAuthModal('register', 'urls')}
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

  const filtered = urls.filter((u) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (u.shortCode && u.shortCode.toLowerCase().includes(term)) ||
      (u.originalUrl && u.originalUrl.toLowerCase().includes(term)) ||
      (u.title && u.title.toLowerCase().includes(term))
    );
  });

  const totalEntries = filtered.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUrls = filtered.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-lg py-xl">
        <div className="flex flex-col w-full">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-2xl">
            <div className="flex flex-col gap-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                Management
              </span>
              <h1 className="font-display text-display text-on-surface tracking-tight">Your URLs</h1>
            </div>

            <div className="flex flex-wrap items-center gap-md">
              <div className="relative w-64 group">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] transition-colors group-focus-within:text-primary">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search links..."
                  className="w-full h-12 pl-[44px] pr-md rounded bg-surface border border-outline-variant/30 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <button
                onClick={fetchUrls}
                className="h-12 px-lg rounded bg-surface border border-outline-variant/30 text-body-md text-on-surface hover:bg-surface-container transition-colors flex items-center gap-sm"
                title="Refresh URLs"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
                Refresh
              </button>

              <button
                onClick={() => setShowNewModal(!showNewModal)}
                className="h-12 px-lg rounded bg-primary text-on-primary font-headline-md text-body-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-sm"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showNewModal ? 'close' : 'add'}
                </span>
                {showNewModal ? 'Close' : 'New Link'}
              </button>
            </div>
          </div>

          {/* New Link Drawer / Accordion */}
          {showNewModal && (
            <div className="mb-xl p-lg bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-md animate-fadeIn">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Create New Short Link</h3>
              <ShortenForm
                onSuccess={(newLink) => {
                  setUrls((prev) => [newLink, ...prev]);
                  setShowNewModal(false);
                }}
              />
            </div>
          )}

          {/* Data Table Container */}
          <div className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded shadow-[0px_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20">
                    <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                      Short Link
                    </th>
                    <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-medium w-full">
                      Destination
                    </th>
                    <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-medium text-right">
                      Clicks
                    </th>
                    <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-medium text-center">
                      Status
                    </th>
                    <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                      Created
                    </th>
                    <th className="px-lg py-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-lg py-2xl text-center text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-[24px] mb-xs">progress_activity</span>
                        <p>Loading links...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-lg py-2xl text-center text-error font-body-md">
                        <p>{error}</p>
                        <button onClick={fetchUrls} className="mt-sm text-xs underline text-primary">Try again</button>
                      </td>
                    </tr>
                  ) : paginatedUrls.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-lg py-2xl text-center text-on-surface-variant">
                        <div className="flex flex-col items-center justify-center gap-xs py-lg">
                          <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40">link_off</span>
                          <p className="font-headline-md text-headline-md text-on-surface font-semibold">No links yet.</p>
                          <p className="text-sm text-on-surface-variant">
                            {search ? 'No links match your search query.' : 'Shorten your first URL to get started.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUrls.map((item) => {
                      const fullShortUrl = item.shortUrl || `${window.location.origin}/${item.shortCode}`;
                      const isActive = item.isActive !== false && !item.expired;
                      return (
                        <tr key={item.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                          <td className="px-lg py-md">
                            <div className="flex items-center gap-sm">
                              <span className="font-mono-url text-mono-url font-medium text-primary">
                                {item.shortCode ? `snip/${item.shortCode}` : fullShortUrl}
                              </span>
                              <button
                                onClick={() => handleCopy(fullShortUrl)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-xs hover:bg-surface-container rounded text-on-surface-variant hover:text-on-surface"
                                title="Copy to clipboard"
                              >
                                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                              </button>
                            </div>
                          </td>
                          <td className="px-lg py-md max-w-[300px] truncate text-on-surface-variant" title={item.originalUrl}>
                            {item.originalUrl}
                          </td>
                          <td className="px-lg py-md text-right font-mono-url text-mono-url font-medium">
                            {item.clickCount != null ? item.clickCount.toLocaleString() : 0}
                          </td>
                          <td className="px-lg py-md text-center">
                            {isActive ? (
                              <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[#E5F6DF] text-[#1D5E0C] font-label-sm text-[11px] uppercase tracking-wider font-semibold">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[#FEE2E2] text-[#991B1B] font-label-sm text-[11px] uppercase tracking-wider font-semibold">
                                Archived
                              </span>
                            )}
                          </td>
                          <td className="px-lg py-md text-on-surface-variant text-sm">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="px-lg py-md text-right">
                            <div className="flex items-center justify-end gap-xs">
                              <button
                                onClick={() => setSelectedQrItem(item)}
                                className="p-xs hover:bg-surface-container rounded text-on-surface-variant hover:text-primary transition-colors"
                                title="QR Code"
                              >
                                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                              </button>
                              <button
                                onClick={() => navigate(`/analytics/${item.id}`)}
                                className="p-xs hover:bg-surface-container rounded text-on-surface-variant hover:text-primary transition-colors"
                                title="View Analytics"
                              >
                                <span className="material-symbols-outlined text-[18px]">query_stats</span>
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-xs hover:bg-error-container/30 rounded text-on-surface-variant hover:text-error transition-colors"
                                title="Delete Link"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="w-full border-t border-outline-variant/20 bg-surface-container-lowest px-lg py-md flex flex-col md:flex-row items-center justify-between gap-md">
              <span className="font-body-md text-sm text-on-surface-variant">
                Showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, totalEntries)} of {totalEntries} entries
              </span>
              <div className="flex items-center gap-sm">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <div className="flex items-center gap-xs">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded font-body-md text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-on-primary font-medium'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
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

export default DashboardPage;
