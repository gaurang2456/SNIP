import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    promptContext,
    closeAuthModal,
    setAuthModalMode,
    login,
    register,
  } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(form.email, form.password);
    setLoading(false);
    if (success) {
      setForm({ email: '', password: '', confirmPassword: '' });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(form.email, form.password, form.confirmPassword);
    setLoading(false);
    if (success) {
      setForm({ email: '', password: '', confirmPassword: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-[420px] bg-surface border border-outline-variant/30 rounded-2xl shadow-xl p-2xl relative flex flex-col gap-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-md right-md text-on-surface-variant hover:text-on-surface p-xs rounded-full hover:bg-surface-container transition-colors"
          title="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* PROMPT MODE */}
        {authModalMode === 'prompt' && (
          <div className="flex flex-col gap-md text-center py-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-xs">
              <span className="material-symbols-outlined text-[26px]">
                {promptContext === 'analytics' ? 'query_stats' : 'bookmark'}
              </span>
            </div>

            {promptContext === 'analytics' ? (
              <>
                <h2 className="font-display text-[24px] text-on-surface font-bold">
                  Your analytics are waiting.
                </h2>
                <p className="font-body-md text-on-surface-variant text-sm max-w-[340px] mx-auto leading-relaxed">
                  Create an account to save your links and track their performance over time.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-display text-[24px] text-on-surface font-bold">
                  Track your links
                </h2>
                <p className="font-body-md text-on-surface-variant text-sm max-w-[340px] mx-auto leading-relaxed">
                  Sign in to save your links and view click analytics across your URLs.
                </p>
              </>
            )}

            <div className="flex flex-col gap-sm mt-md">
              <button
                onClick={() => setAuthModalMode('login')}
                className="w-full py-md rounded-xl bg-primary text-on-primary font-headline-md text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-[0.99]"
              >
                Sign in
              </button>
              <button
                onClick={() => setAuthModalMode('register')}
                className="w-full py-md rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-headline-md text-sm font-semibold hover:bg-surface-container-high transition-all active:scale-[0.99]"
              >
                Create account
              </button>
            </div>
          </div>
        )}

        {/* LOGIN MODE */}
        {authModalMode === 'login' && (
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <h2 className="font-display text-[24px] text-on-surface font-bold">Welcome back</h2>
              <p className="font-body-md text-sm text-on-surface-variant">
                Sign in to manage your saved URLs and analytics.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-md mt-xs">
              <div>
                <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-xs font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full h-11 px-md rounded-lg bg-white border border-outline-variant/30 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-xs font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-11 px-md rounded-lg bg-white border border-outline-variant/30 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-xs rounded-xl bg-primary text-on-primary font-headline-md text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-xs disabled:opacity-70"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>

            <div className="pt-sm border-t border-outline-variant/20 text-center font-body-md text-sm text-on-surface-variant">
              <span>Don't have an account? </span>
              <button
                onClick={() => setAuthModalMode('register')}
                className="text-primary font-semibold hover:underline transition-colors"
              >
                Create account
              </button>
            </div>
          </div>
        )}

        {/* REGISTER MODE */}
        {authModalMode === 'register' && (
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <h2 className="font-display text-[24px] text-on-surface font-bold">Create your account</h2>
              <p className="font-body-md text-sm text-on-surface-variant">
                Save your short links and access link analytics.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-md mt-xs">
              <div>
                <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-xs font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full h-11 px-md rounded-lg bg-white border border-outline-variant/30 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-xs font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-11 px-md rounded-lg bg-white border border-outline-variant/30 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-xs font-semibold">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-11 px-md rounded-lg bg-white border border-outline-variant/30 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-xs rounded-xl bg-primary text-on-primary font-headline-md text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-xs disabled:opacity-70"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span>Create account</span>
                )}
              </button>
            </form>

            <div className="pt-sm border-t border-outline-variant/20 text-center font-body-md text-sm text-on-surface-variant">
              <span>Already have an account? </span>
              <button
                onClick={() => setAuthModalMode('login')}
                className="text-primary font-semibold hover:underline transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
