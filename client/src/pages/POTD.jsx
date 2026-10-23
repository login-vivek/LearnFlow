import { useState, useEffect } from 'react';
import { getPOTD, markSolved } from '../api/problems';
import { logProgress, getStreak } from '../api/progress';
import { PageSpinner } from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { Trophy, Flame, CheckCircle2, Tag, Building2, Calendar, Loader2 } from 'lucide-react';

export default function POTD() {
  const [potd, setPotd]       = useState(null);
  const [streak, setStreak]   = useState(0);
  const [solved, setSolved]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    Promise.all([
      getPOTD().then(r => setPotd(r.data.problem)),
      getStreak().then(r => setStreak(r.data.streak || 0)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSolve = async () => {
    if (!potd || solved) return;
    setMarking(true);
    try {
      await markSolved(potd.id);
      await logProgress({ solvedCount: 1, potdSolved: true });
      setSolved(true);
      setStreak(s => s + 1);
    } catch { /* silent */ }
    finally { setMarking(false); }
  };

  if (loading) return <PageSpinner />;

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString('en-IN', { weekday: 'short' }), date: d.getDate(), isToday: i === 6, done: i < 5 };
  });

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2"><Trophy size={19} className="text-rose-400" strokeWidth={1.8} />Problem of the Day</h1>
        <p className="page-subtitle">{today}</p>
      </div>

      {/* Streak + calendar */}
      <div className="card border border-orange-500/15 bg-gradient-to-b from-orange-500/[0.05] to-transparent">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Flame size={22} className="text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-tight">{streak}</p>
              <p className="text-[12px] text-slate-500">day streak</p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-slate-600">{d.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold ${
                  d.isToday && solved ? 'bg-emerald-500 text-white'
                  : d.isToday ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400'
                  : d.done ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-slate-800 text-slate-600'
                }`}>
                  {d.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem card */}
      {potd ? (
        <div className="card-elevated space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-white leading-snug">{potd.topic}</h2>
            <Badge difficulty={potd.difficulty} />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-[12px] bg-slate-800 border border-slate-700/60 text-slate-400 px-3 py-1.5 rounded-xl">
              <Tag size={11} className="text-orange-400" />Step {potd.step}: {potd.stepTitle}
            </span>
            {potd.company?.filter(c => c !== 'All').map(c => (
              <span key={c} className="flex items-center gap-1.5 text-[12px] bg-slate-800 border border-slate-700/60 text-slate-400 px-3 py-1.5 rounded-xl">
                <Building2 size={11} className="text-amber-400" />{c}
              </span>
            ))}
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Today's challenge</p>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Solve <span className="text-orange-400 font-medium">{potd.topic}</span> — a {potd.difficulty.toLowerCase()} problem asked frequently in placements.
              Focus on the core approach first, then optimise.
            </p>
            <div className="bg-[#080e1a] border border-slate-800 rounded-xl p-4 font-mono text-[12px] text-slate-500">
              <p className="text-slate-600 mb-2">// Java starter</p>
              <p className="text-slate-400">{'public class Solution {'}</p>
              <p className="text-slate-400 ml-4">{'public void solve() {'}</p>
              <p className="text-slate-600 ml-8">{'// your code...'}</p>
              <p className="text-slate-400 ml-4">{'}'}</p>
              <p className="text-slate-400">{'}'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              {solved && (
                <span className="flex items-center gap-1.5 text-[13px] text-emerald-400">
                  <CheckCircle2 size={14} /> Marked as solved!
                </span>
              )}
            </div>
            <button onClick={handleSolve} disabled={solved || marking}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-[13px] transition-all ${
                solved
                  ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 cursor-default'
                  : 'btn-primary'
              }`}>
              {solved ? <><CheckCircle2 size={14} />Solved!</>
                      : marking ? <><Loader2 size={14} className="animate-spin" />Marking…</>
                      : 'Mark as solved'}
            </button>
          </div>
        </div>
      ) : (
        <div className="card text-center py-10 text-[13px] text-slate-500">Could not load today's problem.</div>
      )}

      <div className="card flex items-start gap-3 border border-slate-800/60">
        <Calendar size={16} className="text-orange-400 mt-0.5 shrink-0" strokeWidth={1.8} />
        <div>
          <p className="text-[13px] font-semibold text-slate-300">Build the habit</p>
          <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">
            One problem a day keeps the panic away. Missing a day resets your streak — even 20 focused minutes compounds over weeks.
          </p>
        </div>
      </div>
    </div>
  );
}
