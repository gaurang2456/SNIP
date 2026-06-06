import React, { useState } from 'react';
import { Copy, Check, QrCode, ExternalLink, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { urlApi } from '../api/urlApi';
import './ResultCard.css';

function ResultCard({ url, onDismiss }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="result-card fade-in">
      <div className="result-card__header">
        <div className="result-card__badge">
          <Check size={12} />
          Link created
        </div>
        {onDismiss && (
          <button className="result-card__close" onClick={onDismiss} aria-label="Dismiss">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="result-card__url">
        <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="result-card__short-url">
          {url.shortUrl}
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="result-card__original">
        <span className="result-card__original-label">Original:</span>
        <span className="result-card__original-url">{url.originalUrl}</span>
      </div>

      <div className="result-card__actions">
        <button className={`result-card__copy-btn ${copied ? 'result-card__copy-btn--copied' : ''}`} onClick={handleCopy}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
        <button className="result-card__qr-btn" onClick={() => setShowQr(!showQr)}>
          <QrCode size={15} />
          QR Code
        </button>
      </div>

      {showQr && (
        <div className="result-card__qr fade-in">
          <img
            src={urlApi.getQrCodeUrl(url.id)}
            alt="QR Code"
            className="result-card__qr-img"
          />
          <a
            href={urlApi.getQrCodeUrl(url.id)}
            download={`qr-${url.shortCode}.png`}
            className="result-card__qr-download"
          >
            Download QR
          </a>
        </div>
      )}
    </div>
  );
}

export default ResultCard;
