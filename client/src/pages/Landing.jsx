import { Link } from 'react-router-dom';
import {
  Zap, CalendarDays, BookOpen, Bot, Trophy,
  TrendingUp, Building2, ArrowRight, CheckCircle2,
  Code2, Users, Calculator, StickyNote
} from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Planly',
    tag: 'Smart Scheduling',
    desc: 'Tell Planly your target company, hours per day, and deadline. It builds a day-by-day study schedule and auto-moves anything you miss.',
    accent: 'from-orange-500/20 to-orange-500/5',
    iconColor: 'text-orange-400',
    border: 'hover:border-orange-500/40',
  },
  {
    icon: BookOpen,
    title: 'Prep Hub',
    tag: 'All Roadmaps',
    desc: "Striver's A2Z DSA sheet, OOP, DBMS, OS, CN, SQL and LLD — every roadmap in one place. Track progress across all topics.",
    accent: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-400',
    border: 'hover:border-blue-500/40',
  },
  {
    icon: Bot,
    title: 'TUFY AI',
    tag: 'AI Assistant',
    desc: 'Explain concepts, get hints without spoilers, review your code, generate revision notes — available 24/7 without judgment.',
    accent: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-400',
    border: 'hover:border-violet-500/40',
  },
  {
    icon: Building2,
    title: 'Company Prep',
    tag: 'Targeted Practice',
    desc: 'Amazon, Google, Microsoft, TCS — questions tagged by company with frequency data and topic breakdowns.',
    accent: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-400',
    border: 'hover:border-amber-500/40',
  },
  {
    icon: Trophy,
    title: 'POTD',
    tag: 'Daily Challenge',
    desc: 'One problem every day. Build a streak, revisit past challenges on the calendar, and earn consistency over cramming.',
    accent: 'from-rose-500/20 to-rose-500/5',
    iconColor: 'text-rose-400',
    border: 'hover:border-rose-500/40',
  },
  {
    icon: TrendingUp,
    title: 'Progress',
    tag: 'Analytics',
    desc: 'Visual charts of problems solved and time studied. See your streak, compare topics, and stay honest with yourself.',
    accent: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
    border: 'hover:border-cyan-500/40',
  },
];

const extras = [
  { icon: StickyNote, label: 'Notes & CodeSpace',        desc: 'Save summaries and code snippets' },
  { icon: Users,      label: 'Interview Experiences',    desc: 'Round-by-round stories from the community' },
  { icon: Calculator, label: 'Aptitude Practice',        desc: 'Quant, logical and verbal mock tests' },
  { icon: Code2,      label: 'Problem Bank',             desc: '46+ problems across 10 DSA topics' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#080e1a] text-slate-200">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-20 border-b border-slate-800/60 bg-[#080e1a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-glow">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-[15px] text-white tracking-tight">LearnFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-1.5">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Built for 2025–27 placement season
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight mb-5 max-w-3xl mx-auto">
          Everything you need to{' '}
          <span className="gradient-text">crack placements</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-9 leading-relaxed">
          Personalized study plans, DSA sheets, AI doubt solver, company questions — all in one place.
          Stop switching between 10 websites.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/register" className="btn-primary flex items-center gap-2 px-6 py-2.5 text-[15px]">
            Start for free <ArrowRight size={15} />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 px-6 py-2.5 text-[15px]">
            I have an account
          </Link>
        </div>

        {/* Social proof numbers */}
        <div className="flex items-center justify-center gap-10 mt-14 flex-wrap">
          {[
            ['46+',        'DSA Problems'],
            ['10',         'Study Tracks'],
            ['4',          'Company Sheets'],
            ['AI-Powered', 'Study Plans'],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-white">{val}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">One platform. Everything.</h2>
          <p className="text-slate-500 text-sm">No more tab switching. No more losing track.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, tag, desc, accent, iconColor, border }) => (
            <div
              key={title}
              className={`relative rounded-2xl border border-slate-800/80 bg-gradient-to-b ${accent}
                p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-md ${border} cursor-default`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center`}>
                  <Icon size={17} className={iconColor} strokeWidth={1.8} />
                </div>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-800/60 border border-slate-700/50 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              </div>
              <h3 className="font-semibold text-slate-100 text-[15px] mb-1.5">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── More features row ── */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 md:p-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Also included</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {extras.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={15} className="text-slate-400" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-200">{label}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-b from-orange-500/[0.07] to-transparent p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to start your prep?
          </h2>
          <p className="text-slate-400 mb-7 max-w-md mx-auto">
            Free to use. No credit card. Create your account and Planly will generate your first study plan in seconds.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
            <Link to="/register" className="btn-primary flex items-center gap-2 px-7 py-3 text-[15px]">
              Create free account <ArrowRight size={15} />
            </Link>
          </div>
          <ul className="flex items-center justify-center gap-6 flex-wrap text-sm text-slate-500">
            {['Personalized study plan', 'A2Z DSA sheet', 'TUFY AI included', 'No credit card'].map(item => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/60 py-6">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
              <Zap size={10} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-semibold text-slate-400">LearnFlow</span>
          </div>
          <p className="text-xs text-slate-600">© 2026 LearnFlow. Built for placement warriors.</p>
        </div>
      </footer>
    </div>
  );
}
