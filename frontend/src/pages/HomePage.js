import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, BarChart2, QrCode, Clock, Shield, ArrowRight } from 'lucide-react';
import ShortenForm from '../components/ShortenForm';
import ResultCard from '../components/ResultCard';
import './HomePage.css';

const features = [
  {
    icon: Zap,
    title: 'Lightning fast',
    desc: 'Redis-powered caching for sub-millisecond redirects',
    color: '#f59e0b',
  },
  {
    icon: BarChart2,
    title: 'Click analytics',
    desc: 'Track clicks, referrers, and daily trends in real time',
    color: '#6366f1',
  },
  {
    icon: QrCode,
    title: 'QR codes',
    desc: 'Auto-generate QR codes for every shortened link',
    color: '#06b6d4',
  },
  {
    icon: Clock,
    title: 'Link expiry',
    desc: 'Set expiration dates to auto-deactivate links',
    color: '#10b981',
  },
  {
    icon: Shield,
    title: 'Custom aliases',
    desc: 'Create branded, memorable short links',
    color: '#8b5cf6',
  },
];

function HomePage() {
  const [result, setResult] = useState(null);

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="container">
          <div className="home__hero-content">
            <div className="home__hero-badge">
              <Zap size={13} />
              Fast · Simple · Powerful
            </div>
            <h1 className="home__hero-title">
              Shorten links,<br />
              <span className="home__hero-gradient">amplify reach</span>
            </h1>
            <p className="home__hero-sub">
              Create short, memorable links with analytics, QR codes, and custom aliases — all in one place.
            </p>

            <div className="home__form-card">
              <ShortenForm onSuccess={setResult} />
              {result && (
                <div className="home__result">
                  <ResultCard url={result} onDismiss={() => setResult(null)} />
                </div>
              )}
            </div>

            <Link to="/dashboard" className="home__dashboard-link">
              View all your links
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="home__hero-bg" aria-hidden="true">
          <div className="home__blob home__blob--1" />
          <div className="home__blob home__blob--2" />
        </div>
      </section>

      {/* Features */}
      <section className="home__features">
        <div className="container">
          <h2 className="home__features-title">Everything you need</h2>
          <div className="home__features-grid">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="home__feature-card">
                <div className="home__feature-icon" style={{ background: `${color}18`, color }}>
                  <Icon size={20} />
                </div>
                <h3 className="home__feature-title">{title}</h3>
                <p className="home__feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
