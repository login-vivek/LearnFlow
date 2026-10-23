import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPOTD } from '../api/problems';
import { getActivePlan, completeTask } from '../api/plan';
import { getStreak } from '../api/progress';
import { getSuggestions } from '../api/ai';
import { PageSpinner } from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import {
  Flame, Trophy, CalendarDays, BookOpen, Bot, Building2,
  TrendingUp, CheckCircle2, Circle, ArrowRight, Clock,
  Target, Code2, Zap, StickyNote, Users, Calculator,
  Sparkles, ChevronRight, AlertTriangle, Info, RefreshCw
} from 'lucide-react';

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, accent = 'text-orange-400', iconBg = 'bg-orange-500/10' }) {
  return (
    <div className="card flex items-center gap-3.5">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={accent} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-white leading-tight">{value}</p>
        <p className="text-[12px] text-slate-500 leading-tight mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-orange-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Priority meta ──────────────────────────────────────────────────────────
const PRIORITY_META = {
  high:   { label: 'High',   icon: AlertTriangle, color: 'text-rose-400',  bg: 'bg-rose-500/10',  border: 'border-rose-500/20' },
  medium: { label: 'Medium', icon: Info,          color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  low:    { label: 'Low',    icon: Info,          color: 'text-blue-400',  bg: 'bg-blue-500/10',  border: 'border-blue-500/20' },
};

// ── AI Focus Suggestions card ──────────────────────────────────────────────
function FocusSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [expanded, setExpanded]       = useState(0);

  const load = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const { data } = await getSuggestions();
      setSuggestions(data.suggestions || []);
      setExpanded(0);
    } catch { /* non-critical */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="card border border-violet-500/15 bg-gradient-to-b from-violet-500/[0.05] to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-wide">AI Focus Suggestions</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-slate-800/60 rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
          ))}
        </div>
      </div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <div className="card border border-violet-500/15 bg-gradient-to-b from-violet-500/[0.05] to-transparent">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <Sparkles size={12} className="text-violet-400" />
          </div>
          <span className="text-[12px] font-semibold text-violet-400 uppercase tracking-wide">
            AI Focus Suggestions
          </span>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          aria-label="Refresh suggestions"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin text-violet-400' : ''} />
        </button>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        {suggestions.map((s, i) => {
          const meta     = PRIORITY_META[s.priority] || PRIORITY_META.medium;
          const PrioIcon = meta.icon;
          const isOpen   = expanded === i;

          return (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? `${meta.border} ${meta.bg}`
                  : 'border-slate-700/60 hover:border-slate-600/80'
              }`}
            >
              {/* Always-visible row */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
              >
                <PrioIcon size={13} className={`${meta.color} shrink-0`} />
                <span className={`flex-1 text-[13px] font-medium ${isOpen ? 'text-slate-100' : 'text-slate-300'}`}>
                  {s.topic}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${meta.color} ${meta.bg} ${meta.border}`}>
                  {meta.label}
                </span>
                <ChevronRight
                  size={13}
                  className={`text-slate-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-3 pb-3 space-y-2.5 border-t border-slate-700/40 pt-2.5">
                  <p className="text-[12px] text-slate-400 leading-relaxed">
                    <span className="text-slate-500 font-medium">Why: </span>{s.reason}
                  </p>
                  <div className="flex items-start gap-2 bg-slate-900/60 border border-slate-700/50 rounded-xl px-3 py-2.5">
                    <Zap size={12} className="text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-slate-300 leading-relaxed">
                      <span className="text-orange-400 font-medium">How: </span>{s.tip}
                    </p>
                  </div>
                  <div className="flex gap-3 pt-0.5">
                    <Link
                      to="/prep-hub"
                      className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition-colors font-medium"
                    >
                      <BookOpen size={11} /> Study in Prep Hub
                    </Link>
                    <span className="text-slate-700">·</span>
                    <Link
                      to="/tufy"
                      className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition-colors font-medium"
                    >
                      <Bot size={11} /> Ask TUFY
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-600 mt-3">
        Based on your last 14 days of activity · Refresh to update
      </p>
    </div>
  );
}

// ── Quick links ────────────────────────────────────────────────────────────
const quickLinks = [
  { to: '/planly',      icon: CalendarDays, label: 'Planly',      accent: 'text-orange-400',  bg: 'bg-orange-500/10' },
  { to: '/prep-hub',    icon: BookOpen,     label: 'Prep Hub',    accent: 'text-blue-400',    bg: 'bg-blue-500/10' },
  { to: '/tufy',        icon: Bot,          label: 'TUFY AI',     accent: 'text-violet-400',  bg: 'bg-violet-500/10' },
  { to: '/companies',   icon: Building2,    label: 'Companies',   accent: 'text-amber-400',   bg: 'bg-amber-500/10' },
  { to: '/notes',       icon: StickyNote,   label: 'Notes',       accent: 'text-slate-300',   bg: 'bg-slate-700/60' },
  { to: '/experiences', icon: Users,        label: 'Experiences', accent: 'text-cyan-400',    bg: 'bg-cyan-500/10' },
  { to: '/progress',    icon: TrendingUp,   label: 'Progress',    accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { to: '/aptitude',    icon: Calculator,   label: 'Aptitude',    accent: 'text-purple-400',  bg: 'bg-purple-500/10' },
];

// ── Dashboard Page ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [potd, setPotd]       = useState(null);
  const [plan, setPlan]       = useState(null);
  const [streak, setStreak]   = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPOTD().then(r => setPotd(r.data.problem)).catch(() => {}),
      getActivePlan().then(r => setPlan(r.data.plan)).catch(() => {}),
      getStreak().then(r => setStreak(r.data.streak || 0)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const todayStr       = new Date().toISOString().split('T')[0];
  const todayTasks     = plan?.tasks?.filter(t => t.date === todayStr) || [];
  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalSolved    = user?.solvedProblems?.length || 0;

  const handleComplete = async (taskId) => {
    try {
      await completeTask(taskId);
      setPlan(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t._id === taskId ? { ...t, completed: true } : t),
      }));
    } catch { /* silent */ }
  };

  if (loading) return <PageSpinner />;

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        {plan && (
          <div className="text-right text-[12px]">
            <p className="text-slate-500">Target</p>
            <p className="font-semibold text-orange-400">{plan.targetCompany} — {plan.targetRole}</p>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Flame}        label="Day streak"      value={streak}         sub={streak > 0 ? 'Keep going!' : null} accent="text-orange-400"  iconBg="bg-orange-500/10" />
        <StatCard icon={Code2}        label="Problems solved" value={totalSolved}    accent="text-emerald-400" iconBg="bg-emerald-500/10" />
        <StatCard icon={CheckCircle2} label="Done today"      value={`${completedToday}/${todayTasks.length || 0}`} accent="text-blue-400" iconBg="bg-blue-500/10" />
        <StatCard icon={Target}       label="Deadline"        value={plan ? new Date(plan.deadline + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'} accent="text-violet-400" iconBg="bg-violet-500/10" />
      </div>

      {/* AI Focus Suggestions — full width */}
      <FocusSuggestions />

      {/* Main two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Today's tasks — 3 cols */}
        <div className="lg:col-span-3 card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-slate-200 flex items-center gap-2">
              <CalendarDays size={15} className="text-orange-400" strokeWidth={1.8} />
              Today's tasks
            </h2>
            <Link to="/planly" className="text-[12px] text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors">
              View plan <ArrowRight size={12} />
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className="py-8 text-center">
              <Zap size={24} className="text-slate-700 mx-auto mb-2" />
              {plan
                ? <p className="text-[13px] text-slate-500">Nothing scheduled for today.</p>
                : <>
                    <p className="text-[13px] text-slate-400 mb-3">No active study plan yet.</p>
                    <Link to="/planly" className="btn-primary text-sm">Create your plan</Link>
                  </>
              }
            </div>
          ) : (
            <ul className="space-y-1.5">
              {todayTasks.map(task => (
                <li
                  key={task._id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                    task.completed
                      ? 'border-emerald-500/15 bg-emerald-500/5'
                      : 'border-slate-700/60 hover:border-slate-600/80'
                  }`}
                >
                  <button
                    onClick={() => !task.completed && handleComplete(task._id)}
                    className={`shrink-0 transition-colors ${task.completed ? 'text-emerald-400 cursor-default' : 'text-slate-600 hover:text-orange-400'}`}
                  >
                    {task.completed ? <CheckCircle2 size={17} /> : <Circle size={17} strokeWidth={1.5} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-medium ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                      {task.topic}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 shrink-0">
                    <Clock size={11} /> {task.duration}m
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right col — POTD + quick links */}
        <div className="lg:col-span-2 space-y-3">

          {/* POTD */}
          <div className="card border border-orange-500/15 bg-gradient-to-b from-orange-500/[0.06] to-transparent">
            <div className="flex items-center gap-2 mb-2.5">
              <Trophy size={13} className="text-orange-400" strokeWidth={2} />
              <span className="text-[12px] font-semibold text-orange-400 uppercase tracking-wide">Problem of the day</span>
            </div>
            {potd ? (
              <>
                <p className="text-[14px] font-semibold text-slate-200 mb-2 leading-snug">{potd.topic}</p>
                <div className="flex items-center justify-between">
                  <Badge difficulty={potd.difficulty} />
                  <Link to="/potd" className="text-[12px] text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors">
                    Solve <ArrowRight size={11} />
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-[13px] text-slate-500">Loading…</p>
            )}
          </div>

          {/* Quick links grid */}
          <div className="card">
            <p className="text-[12px] font-semibold text-slate-500 mb-3 uppercase tracking-wide">Quick access</p>
            <div className="grid grid-cols-4 gap-2">
              {quickLinks.map(({ to, icon: Icon, label, accent, bg }) => (
                <Link
                  key={to} to={to}
                  className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl hover:bg-slate-800/60 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon size={14} className={accent} strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] text-slate-500 text-center leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
