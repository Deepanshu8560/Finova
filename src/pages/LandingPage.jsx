import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Database, Shield, BarChart3, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';
import { ThreeDMotionGraphic } from '../components/ui/ThreeDMotionGraphic';

/* ─────────────────────────────────────────────────
   Ticker bar items
───────────────────────────────────────────────── */
const TICKER_ITEMS = [
  '1,200+ Smart Savers',
  '24/7 Smart Monitoring',
  'Instant Bank Sync',
  '99.9% Uptime',
  'AES-256 Encrypted',
  'Manual Entry Free',
];

/**
 * Landing page - public-facing marketing page for Finova.
 * Includes sticky nav, hero, social-proof ticker, features grid, and footer.
 * @returns {JSX.Element}
 */
export function LandingPage() {
  const { user } = useAuthContext();
  const [scrolled,   setScrolled]   = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#060d1a] text-white overflow-x-hidden selection:bg-primary-500/30">

      {/* ── Ambient glow blobs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[55%] h-[55%] rounded-full bg-primary-600/15 blur-[140px]" />
        <div className="absolute top-[35%] -right-[10%] w-[45%] h-[45%] rounded-full bg-violet-600/12 blur-[140px]" />
        <div className="absolute top-[70%] left-[20%] w-[35%] h-[35%] rounded-full bg-primary-500/8 blur-[120px]" />
      </div>

      {/* ════════════════════════════════
          STICKY NAV
      ════════════════════════════════ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#060d1a]/90 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md group-hover:shadow-primary-500/30 transition-shadow">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Finova</span>
          </Link>

          {/* Nav actions */}
          <nav className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <button className="flex items-center gap-1.5 text-sm font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-200">
                  Go to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link to="/auth">
                  <button className="flex items-center gap-1.5 text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-primary-500/30 hover:-translate-y-px">
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <main className="relative z-10 pt-32 pb-24 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className={`flex flex-col items-center text-center transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/25 text-primary-400 text-sm font-semibold mb-7 backdrop-blur-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              Smart Finance Tracking
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-extrabold tracking-tight leading-[1.05] mb-6 max-w-5xl">
              Understand Your Data{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-emerald-300 bg-clip-text text-transparent">
                Instantly.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
              Finova turns your spending habits into actionable growth segments.{' '}
              <span className="text-slate-300">Automated trends. Smart budgeting. Total financial clarity.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
              {user ? (
                <Link to="/dashboard">
                  <button className="flex items-center gap-2 text-base font-semibold bg-primary-500 hover:bg-primary-600 text-white px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5">
                    Return to Dashboard →
                  </button>
                </Link>
              ) : (
                <Link to="/auth">
                  <button className="flex items-center gap-2 text-base font-semibold bg-primary-500 hover:bg-primary-600 text-white px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5">
                    Start Free →
                  </button>
                </Link>
              )}
              <a href="#demo">
                <button className="flex items-center gap-2 text-base font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-white/5 backdrop-blur-sm">
                  Watch Demo
                </button>
              </a>
            </div>

            {/* Social proof avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['AC', 'MJ', 'SR'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#060d1a] flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: ['#10b981','#6366f1','#f59e0b'][i] }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                <span className="font-semibold text-slate-200">Join 1,200+</span> individuals already using Finova
              </p>
            </div>
          </div>

          {/* ── 3D Motion Graphic Hero ── */}
          <div
            id="demo"
            className={`mt-24 max-w-6xl mx-auto transition-all duration-1000 delay-300 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            }`}
          >
            <ThreeDMotionGraphic />
          </div>
        </div>
      </main>

      {/* ════════════════════════════════
          SOCIAL PROOF TICKER BAR
      ════════════════════════════════ */}
      <section className="relative z-10 bg-slate-900/80 border-y border-slate-800/60 py-5 overflow-hidden">
        <div className="flex gap-0 animate-ticker-scroll">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-6 shrink-0 px-8">
              {item === 'Real-time Updates' ? (
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 rounded-full px-3 py-1 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm font-bold text-emerald-400 whitespace-nowrap">Live Syncing</span>
                </div>
              ) : (
                <span className="text-sm font-semibold text-slate-300 whitespace-nowrap">{item}</span>
              )}
              <span className="text-primary-500 text-lg">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Master your money with ease.
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Everything you need to understand your finances - zero manual tracking required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              color: 'text-primary-400',
              bg: 'bg-primary-500/10',
              border: 'border-primary-500/20',
              title: 'Categorized Spending',
              desc: 'Automatically categorize and visualize your spending to find hidden savings and stay on top of your monthly budget.',
            },
            {
              icon: BarChart3,
              color: 'text-violet-400',
              bg: 'bg-violet-500/10',
              border: 'border-violet-500/20',
              title: 'Real-Time Tracking',
              desc: 'Stop guessing where your money goes. Get instant updates on every transaction and see your net worth evolve in real-time.',
            },
            {
              icon: Shield,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
              border: 'border-emerald-500/20',
              title: 'Bank-Level Security',
              desc: 'Your privacy is our priority. We use AES-256 encryption and secure OAuth connections to keep your financial data safe and anonymous.',
            },
          ].map(feature => (
            <div
              key={feature.title}
              className={`group rounded-2xl border ${feature.border} bg-slate-900/50 backdrop-blur-sm p-8 hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          CTA BANNER
      ════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-28">
        <div className="relative rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-slate-900 to-slate-900 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary-400/60 to-transparent" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to master your finances?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join 1,200+ individuals who get instant clarity from their spending.
          </p>
          {user ? (
            <Link to="/dashboard">
              <button className="inline-flex items-center gap-2 text-base font-semibold bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <Link to="/auth">
              <button className="inline-flex items-center gap-2 text-base font-semibold bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5">
                Start Free - No credit card needed
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-800/60 bg-slate-950/80 py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-primary-400" />
            </div>
            <span className="font-bold text-white tracking-tight">Finova</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>

          <p className="text-sm text-slate-600">© 2026 Finova, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
