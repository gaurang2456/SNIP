import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ShortenForm from '../components/ShortenForm';
import QrCodeModal from '../components/QrCodeModal';
import { urlApi } from '../api/urlApi';

function HomePage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQrItem, setSelectedQrItem] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await urlApi.getAllUrls();
      const list = res.data?.data || res.data || [];
      setUrls(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
      setError('Unable to load links. Make sure backend server is running.');
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleCreated = (newUrl) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this short link?')) return;
    try {
      await urlApi.deleteUrl(id);
      toast.success('Link deleted successfully');
      setUrls((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error('Failed to delete link');
    }
  };

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-lg py-xl">
        <div className="flex flex-col w-full gap-2xl">
          {/* Hero Section */}
          <section className="flex flex-col items-center justify-center py-2xl">
            <div className="w-full max-w-[800px] flex flex-col gap-md text-center">
              <h1 className="font-display text-display text-on-surface tracking-tight">Shorten a URL</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mx-auto">
                Create brief, memorable links. Paste your long URL below to get started.
              </p>
              <div className="mt-lg w-full">
                <ShortenForm onSuccess={handleCreated} />
              </div>
            </div>
          </section>

          {/* Recent Links Section */}
          <section className="flex flex-col gap-lg w-full">
            <div className="flex items-center justify-between pb-sm border-b border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface">Your recent links</h2>
              <div className="flex items-center gap-sm">
                <button
                  onClick={fetchUrls}
                  className="text-on-surface-variant hover:text-on-surface transition-colors p-sm rounded-full hover:bg-surface-container flex items-center justify-center"
                  title="Refresh list"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full" id="url-list">
              {loading ? (
                <div className="py-xl text-center text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined animate-spin text-[24px] mb-xs">progress_activity</span>
                  <p>Loading your links...</p>
                </div>
              ) : error ? (
                <div className="py-xl text-center text-error font-body-md">
                  <p>{error}</p>
                  <button onClick={fetchUrls} className="mt-sm text-xs underline text-primary">Try again</button>
                </div>
              ) : urls.length === 0 ? (
                <div className="py-2xl text-center flex flex-col items-center justify-center gap-xs">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-xs">
                    <span className="material-symbols-outlined text-[24px]">link_off</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">No links created yet</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-[400px]">
                    Paste a URL above to create your first shortened link.
                  </p>
                </div>
              ) : (
                urls.slice(0, visibleCount).map((item) => {
                  const shortUrl = item.shortUrl || `${window.location.origin}/${item.shortCode}`;
                  const isActive = item.isActive !== false && !item.expired;
                  return (
                    <div
                      key={item.id}
                      className={`group flex items-center justify-between py-md border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors px-md -mx-md rounded-lg ${
                        !isActive ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-xl min-w-0 flex-1">
                        <div className="flex flex-col gap-xs min-w-0 flex-1">
                          <div className="flex items-center gap-sm">
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#10B981]' : 'bg-error'}`}></div>
                            <a
                              href={shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`font-mono-url text-mono-url font-medium flex items-center gap-xs hover:underline ${
                                isActive ? 'text-primary' : 'text-on-surface-variant line-through'
                              }`}
                            >
                              {item.shortCode ? `snip/${item.shortCode}` : shortUrl}
                              <span className="material-symbols-outlined text-[14px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                                open_in_new
                              </span>
                            </a>
                          </div>
                          <span className="font-body-md text-body-md text-on-surface-variant truncate">
                            {item.originalUrl}
                          </span>
                        </div>
                        <div className="hidden md:flex flex-col items-end gap-xs min-w-[100px]">
                          <span className="font-headline-md text-headline-md text-on-surface tracking-tight">
                            {item.clickCount != null ? item.clickCount.toLocaleString() : 0}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Clicks</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-xs ml-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(shortUrl)}
                          className="p-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-colors flex items-center justify-center"
                          title="Copy Link"
                        >
                          <span className="material-symbols-outlined text-[20px]">content_copy</span>
                        </button>
                        <button
                          onClick={() => setSelectedQrItem(item)}
                          className="p-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-colors flex items-center justify-center"
                          title="QR Code"
                        >
                          <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-sm text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-full transition-colors flex items-center justify-center"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {urls.length > visibleCount && (
              <div className="flex justify-center pt-md">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-xs"
                >
                  Load more
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20 py-xl mt-2xl">
        <div className="max-w-[1200px] mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md text-label-sm text-on-surface-variant uppercase tracking-wider">
          <span>© 2026 SNIP URL Shortener</span>
          <div className="flex gap-lg">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">API</a>
          </div>
        </div>
      </footer>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={Boolean(selectedQrItem)}
        onClose={() => setSelectedQrItem(null)}
        urlItem={selectedQrItem}
      />
    </main>
  );
}

export default HomePage;
