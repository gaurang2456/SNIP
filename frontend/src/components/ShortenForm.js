import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { urlApi } from '../api/urlApi';

function ShortenForm({ onSuccess }) {
  const [form, setForm] = useState({
    originalUrl: '',
    customAlias: '',
    expiryDays: '',
    title: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.originalUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setDone(false);

    try {
      let formattedUrl = form.originalUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }

      const payload = {
        originalUrl: formattedUrl,
        customAlias: form.customAlias.trim() || null,
        expiryDays: form.expiryDays ? parseInt(form.expiryDays, 10) : null,
        title: form.title.trim() || null,
      };

      const res = await urlApi.createUrl(payload);
      const createdData = res.data?.data || res.data;

      setDone(true);
      toast.success('Short link created!');

      if (onSuccess) {
        onSuccess(createdData);
      }

      setTimeout(() => {
        setDone(false);
        setForm({ originalUrl: '', customAlias: '', expiryDays: '', title: '' });
      }, 1500);

    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create short link';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-md">
      <div className="relative w-full group">
        <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="relative flex items-center bg-surface-container-lowest shadow-lg shadow-black/[0.03] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 border border-outline-variant/20 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant ml-lg mr-sm text-[24px]">link</span>
          <input
            type="url"
            name="originalUrl"
            value={form.originalUrl}
            onChange={handleChange}
            placeholder="https://your-very-long-url.com/goes/here"
            className="flex-1 bg-transparent py-lg font-mono-url text-mono-url text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none min-w-0"
            required
          />
          <button
            type="submit"
            disabled={loading || done}
            className={`font-label-sm text-label-sm uppercase tracking-wider px-xl py-lg transition-all flex items-center gap-sm active:scale-[0.98] mr-xs rounded-lg my-xs ${
              done
                ? 'bg-[#10B981] text-white'
                : loading
                ? 'bg-primary/80 text-on-primary cursor-wait'
                : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Shortening</span>
              </>
            ) : done ? (
              <>
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>Done</span>
              </>
            ) : (
              <>
                <span>Shorten</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="text-on-surface-variant hover:text-primary font-label-sm text-xs uppercase tracking-wider flex items-center gap-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">{showOptions ? 'tune' : 'tune'}</span>
          {showOptions ? 'Hide options' : 'Custom alias & options'}
        </button>
      </div>

      {showOptions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md p-md bg-surface-container-low rounded-lg border border-outline-variant/20 transition-all">
          <div>
            <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
              Custom Alias
            </label>
            <div className="flex items-center bg-white border border-outline-variant/30 rounded px-sm py-xs">
              <span className="text-xs text-on-surface-variant font-mono-url mr-xs">snip/</span>
              <input
                type="text"
                name="customAlias"
                value={form.customAlias}
                onChange={handleChange}
                placeholder="my-alias"
                className="w-full bg-transparent text-sm font-mono-url focus:outline-none text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
              Expiry (Days)
            </label>
            <input
              type="number"
              name="expiryDays"
              value={form.expiryDays}
              onChange={handleChange}
              placeholder="30"
              min="1"
              max="365"
              className="w-full bg-white border border-outline-variant/30 rounded px-sm py-xs text-sm text-on-surface focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
              Title / Tag
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Marketing campaign"
              className="w-full bg-white border border-outline-variant/30 rounded px-sm py-xs text-sm text-on-surface focus:outline-none"
            />
          </div>
        </div>
      )}
    </form>
  );
}

export default ShortenForm;

