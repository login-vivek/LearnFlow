import { useState, useEffect } from 'react';
import { getProgress, getStreak, logProgress } from '../api/progress';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/ui/Spinner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Flame, Code2, Clock, CheckCircle2, Plus, Loader2 } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, accent, iconBg }) {
  return (
    <div className="card flex items-center gap-3.5">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={17} className={accent} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-xl font-bold text-white leading-tight">{value}</p>
        <p className="text-[12px] text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-[12px] shadow-card-md">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function Progress() {
  const { user } = useAuth();
  const [progress, setProgress]   = useState([]);
  const [streak, setStreak]       = useState(0);
  const [loading, setLoading]     = useState(true);
  const [range, setRange]         = useState(30);
  const [logForm, setLogForm]     = useState({ solvedCount: 0, minutesStudied: 0, topics: '' });
  const [logging, setLogging]     = useState(false);
  const [logDone, setLogDone]     = useState(false);

  const load = (days) => {
    setLoading(true);
    Promise.all([
      getProgress(days).then(r => setProgress(r.data.progress || [])),
      getStreak().then(r => setStreak(r.data.streak || 0)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { load(range); }, [range]);

  const handleLog = async (e) => {
    e.preventDefault();
    setLogging(true);
    try {
      await logProgress({
        solvedCount:    Number(logForm.solvedCount),
        minutesStudied: Number(logForm.minutesStudied),
        topics: logForm.topics.split(',').map(t => t.trim()).filter(Boolean),
      });
      setLogDone(true);
      setLogForm({ solvedCount: 0, minutesStudied: 0, topics: '' });
      load(range);
      setTimeout(() => setLogDone(false), 3000);
    } catch { /* silent */ }
    finally { setLogging(false); }
  };

  const totalSolved  = progress.reduce((a, p) => a + (p.solvedCount || 0), 0);
  const totalMinutes = progress.reduce((a, p) => a + (p.minutesStudied || 0), 0);
  const totalHours   = Math.round(totalMinutes / 60 * 10) / 10;
  const potdCount    = progress.filter(p => p.potdSolved).length;

  const chartData = Array.from({ length: Math.min(range, 30) }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (Math.min(range,30)-1-i));
    const key   = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const found = progress.find(p => p.date === key);
    return { date: label, Solved: found?.solvedCount || 0, Minutes: found?.minutesStudied || 0 };
  });

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2"><TrendingUp size={19} className="text-cyan-400" strokeWidth={1.8} />Progress</h1>
        <p className="page-subtitle">Track your daily study activity and growth</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Flame}        label="Current streak"   value={`${streak}d`}   accent="text-orange-400" iconBg="bg-orange-500/10" />
        <StatCard icon={Code2}        label="Total solved"     value={user?.solvedProblems?.length || 0} accent="text-emerald-400" iconBg="bg-emerald-500/10" />
        <StatCard icon={Clock}        label="Hours studied"    value={`${totalHours}h`} sub={`last ${range} days`} accent="text-blue-400" iconBg="bg-blue-500/10" />
        <StatCard icon={CheckCircle2} label="POTD solved"      value={potdCount}      accent="text-violet-400" iconBg="bg-violet-500/10" />
      </div>

      {/* Range toggle */}
      <div className="flex gap-1.5 bg-slate-800/60 p-1 rounded-xl w-fit">
        {[7, 14, 30].map(d => (
          <button key={d} onClick={() => setRange(d)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${range === d ? 'bg-slate-700 text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
            {d}d
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-[13px] font-semibold text-slate-300 mb-4">Problems solved / day</h3>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} allowDecimals={false} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="Solved" stroke="#f97316" fill="url(#sg)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-[13px] font-semibold text-slate-300 mb-4">Study time (minutes)</h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="Minutes" fill="#06b6d4" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Log form */}
      <div className="card">
        <h3 className="text-[13px] font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Plus size={14} className="text-orange-400" />Log today's activity
        </h3>
        {logDone && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[13px] rounded-xl px-4 py-2.5 mb-4">
            <CheckCircle2 size={13} />Progress logged!
          </div>
        )}
        <form onSubmit={handleLog} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[12px] text-slate-500 mb-1">Problems solved</label>
            <input type="number" min={0} value={logForm.solvedCount} onChange={e => setLogForm(f => ({ ...f, solvedCount: e.target.value }))} className="input text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] text-slate-500 mb-1">Minutes studied</label>
            <input type="number" min={0} value={logForm.minutesStudied} onChange={e => setLogForm(f => ({ ...f, minutesStudied: e.target.value }))} className="input text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] text-slate-500 mb-1">Topics (comma-separated)</label>
            <input type="text" value={logForm.topics} onChange={e => setLogForm(f => ({ ...f, topics: e.target.value }))} placeholder="Arrays, Trees, DP" className="input text-[13px]" />
          </div>
          <div className="sm:col-span-3">
            <button type="submit" disabled={logging} className="btn-primary flex items-center gap-2 text-[13px]">
              {logging ? <><Loader2 size={13} className="animate-spin" />Logging…</> : 'Log activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
