import React, { useState } from 'react';
import { Link2, Wand2, Clock, Tag, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { urlApi } from '../api/urlApi';
import './ShortenForm.css';

function ShortenForm({ onSuccess }) {
  const [form, setForm] = useState({
    originalUrl: '',
    customAlias: '',
    expiryDays: '',
    title: '',
  });
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.originalUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        originalUrl: form.originalUrl.trim(),
        customAlias: form.customAlias.trim() || null,
        expiryDays: form.expiryDays ? parseInt(form.expiryDays) : null,
        title: form.title.trim() || null,
      };

      const res = await urlApi.createUrl(payload);
      toast.success('Short URL created!');
      onSuccess(res.data.data);
      setForm({ originalUrl: '', customAlias: '', expiryDays: '', title: '' });
      setShowAdvanced(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create short URL';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="shorten-form" onSubmit={handleSubmit}>
      <div className="shorten-form__main">
        <div className="shorten-form__input-wrap">
          <Link2 size={18} className="shorten-form__icon" />
          <input
            type="url"
            name="originalUrl"
            value={form.originalUrl}
            onChange={handleChange}
            placeholder="Paste your long URL here..."
            className="shorten-form__input"
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="shorten-form__btn"
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={18} className="spin" />
          ) : (
            <Sparkles size={18} />
          )}
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>

      <button
        type="button"
        className="shorten-form__advanced-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <Wand2 size={14} />
        {showAdvanced ? 'Hide options' : 'Advanced options'}
      </button>

      {showAdvanced && (
        <div className="shorten-form__advanced fade-in">
          <div className="shorten-form__field">
            <label className="shorten-form__label">
              <Tag size={14} />
              Custom alias
            </label>
            <div className="shorten-form__alias-wrap">
              <span className="shorten-form__alias-prefix">snip.io/</span>
              <input
                type="text"
                name="customAlias"
                value={form.customAlias}
                onChange={handleChange}
                placeholder="my-custom-link"
                className="shorten-form__alias-input"
                pattern="^[a-zA-Z0-9_-]*$"
                minLength={3}
                maxLength={30}
              />
            </div>
          </div>

          <div className="shorten-form__field">
            <label className="shorten-form__label">
              <Clock size={14} />
              Expiry (days)
            </label>
            <input
              type="number"
              name="expiryDays"
              value={form.expiryDays}
              onChange={handleChange}
              placeholder="Never expires"
              className="shorten-form__text-input"
              min={1}
              max={365}
            />
          </div>

          <div className="shorten-form__field">
            <label className="shorten-form__label">
              <Tag size={14} />
              Title (optional)
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give it a name..."
              className="shorten-form__text-input"
              maxLength={100}
            />
          </div>
        </div>
      )}
    </form>
  );
}

export default ShortenForm;

