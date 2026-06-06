import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy, Trash2, BarChart2, QrCode, ExternalLink,
  Check, Clock, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { urlApi } from '../api/urlApi';
import './UrlTable.css';

function UrlTable({ urls, onDelete, loading }) {
  const [copiedId, setCopiedId] = useState(null);
  const [expandedQr, setExpandedQr] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopiedId(url.id);
      toast.success('Copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this link?')) return;
    try {
      await urlApi.deleteUrl(id);
      toast.success('Link deactivated');
      onDelete(id);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...urls].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortField === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  if (loading) {
    return (
      <div className="url-table__skeleton">
        {[1, 2, 3].map(i => (
          <div key={i} className="url-table__skeleton-row">
            <div className="skeleton" style={{ height: 16, width: '40%' }} />
            <div className="skeleton" style={{ height: 16, width: '20%' }} />
            <div className="skeleton" style={{ height: 16, width: '15%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="url-table__empty">
        <div className="url-table__empty-icon">🔗</div>
        <p className="url-table__empty-title">No links yet</p>
        <p className="url-table__empty-sub">Create your first short link to get started</p>
      </div>
    );
  }

  return (
    <div className="url-table-wrap">
      <table className="url-table">
        <thead>
          <tr>
            <th className="url-table__th">Link</th>
            <th
              className="url-table__th url-table__th--sortable"
              onClick={() => handleSort('clickCount')}
            >
              Clicks <SortIcon field="clickCount" />
            </th>
            <th
              className="url-table__th url-table__th--sortable"
              onClick={() => handleSort('createdAt')}
            >
              Created <SortIcon field="createdAt" />
            </th>
            <th className="url-table__th">Status</th>
            <th className="url-table__th url-table__th--right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((url) => (
            <React.Fragment key={url.id}>
              <tr className="url-table__row">
                <td className="url-table__td url-table__td--link">
                  <div className="url-table__link-info">
                    {url.title && <span className="url-table__title">{url.title}</span>}
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="url-table__short"
                    >
                      {url.shortUrl.replace('http://localhost:8080/', '')}
                      <ExternalLink size={11} />
                    </a>
                    <span className="url-table__original">{url.originalUrl}</span>
                  </div>
                </td>
                <td className="url-table__td">
                  <span className="url-table__clicks">{url.clickCount.toLocaleString()}</span>
                </td>
                <td className="url-table__td url-table__td--date">
                  {new Date(url.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                  {url.expiresAt && (
                    <span className="url-table__expiry">
                      <Clock size={11} />
                      Expires {new Date(url.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </td>
                <td className="url-table__td">
                  {url.expired ? (
                    <span className="url-table__badge url-table__badge--expired">
                      <AlertCircle size={11} /> Expired
                    </span>
                  ) : (
                    <span className="url-table__badge url-table__badge--active">
                      <Check size={11} /> Active
                    </span>
                  )}
                </td>
                <td className="url-table__td url-table__td--actions">
                  <div className="url-table__actions">
                    <button
                      className="url-table__action-btn"
                      onClick={() => handleCopy(url)}
                      title="Copy link"
                    >
                      {copiedId === url.id ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                    <button
                      className="url-table__action-btn"
                      onClick={() => setExpandedQr(expandedQr === url.id ? null : url.id)}
                      title="QR Code"
                    >
                      <QrCode size={15} />
                    </button>
                    <Link
                      to={`/analytics/${url.id}`}
                      className="url-table__action-btn"
                      title="Analytics"
                    >
                      <BarChart2 size={15} />
                    </Link>
                    <button
                      className="url-table__action-btn url-table__action-btn--danger"
                      onClick={() => handleDelete(url.id)}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedQr === url.id && (
                <tr className="url-table__qr-row">
                  <td colSpan={5}>
                    <div className="url-table__qr-panel fade-in">
                      <img
                        src={urlApi.getQrCodeUrl(url.id)}
                        alt="QR Code"
                        className="url-table__qr-img"
                      />
                      <div className="url-table__qr-info">
                        <p className="url-table__qr-label">QR Code for</p>
                        <p className="url-table__qr-url">{url.shortUrl}</p>
                        <a
                          href={urlApi.getQrCodeUrl(url.id)}
                          download={`qr-${url.shortCode}.png`}
                          className="url-table__qr-download"
                        >
                          Download PNG
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UrlTable;
