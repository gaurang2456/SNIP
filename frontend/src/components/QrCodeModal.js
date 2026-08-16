import React from 'react';

function QrCodeModal({ isOpen, onClose, urlItem }) {
  if (!isOpen || !urlItem) return null;

  const qrImageUrl = `/api/urls/${urlItem.id}/qr`;
  const displayUrl = urlItem.shortUrl || `${window.location.origin}/${urlItem.shortCode}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `qr-${urlItem.shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-md animate-fadeIn">
      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-2xl max-w-sm w-full p-xl flex flex-col items-center gap-md relative">
        <button
          onClick={onClose}
          className="absolute top-md right-md text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container"
          title="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex flex-col items-center text-center gap-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">QR Code</span>
          <h3 className="font-headline-md text-headline-md text-on-surface">{urlItem.title || urlItem.shortCode}</h3>
          <p className="font-mono-url text-mono-url text-primary font-medium break-all">{displayUrl}</p>
        </div>

        <div className="w-48 h-48 bg-surface-container-low border border-outline-variant/20 rounded-lg p-sm flex items-center justify-center my-sm">
          <img
            src={qrImageUrl}
            alt={`QR Code for ${urlItem.shortCode}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              // fallback if API is not yet responding
              e.target.onerror = null;
              e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(displayUrl)}`;
            }}
          />
        </div>

        <div className="flex items-center gap-sm w-full">
          <button
            onClick={handleDownload}
            className="flex-1 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider py-md px-lg rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download PNG
          </button>
          <button
            onClick={onClose}
            className="px-lg py-md rounded-lg border border-outline-variant/30 text-body-md text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default QrCodeModal;
