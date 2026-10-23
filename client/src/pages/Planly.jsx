import { useState, useEffect } from 'react';
import { createPlan, getActivePlan, completeTask, reschedulePlan } from '../api/plan';
import { PageSpinner } from '../components/ui/Spinner';
import {
  CalendarDays, Plus, CheckCircle2, Circle, RefreshCw,
  Clock, Target, Loader2, ChevronDown, ChevronUp,
  Building2, Briefcase, AlertCircle, Zap
} from 'lucide-react';

const COMPANIES = ['Amazon', 'Google', 'Microsoft', 'TCS', 'Infosys', 'Wipro', 'Adobe', 'Goldman Sachs', 'Flipkart', 'Uber', 'Other'];
const ROLES     = ['SDE-1', 'SDE-2', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'Data Engineer', 'Other'];

function CreatePlanForm({ onCreated }) {
  const [form, setForm]       = useState({ targetCompany: '', targetRole: '', hoursPerDay: 2, deadline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await createPlan(form);
      onCreated(data.plan);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="card-elevated px-6 py-7">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <CalendarDays size={19} className="text-orange-400" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="font-bold text-white text-[15px]">Create your study plan</h2>
            <p className="text-[13px] text-slate-500">Planly builds your day-by-day roadmap</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[13px] rounded-xl px-4 py-3 mb-5">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building2 size={13} /> Target company
            </label>
            <select value={form.targetCompany} onChange={e => setForm(f => ({ ...f, targetCompany: e.target.value }))} className="input" required>
              <option value="">Select company…</option>
              {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Briefcase size={13} /> Target role
            </label>
            <select value={form.targetRole} onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))} className="input" required>
              <option value="">Select role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              <Clock size={13} />
              Hours per day —&nbsp;<span className="text-orange-400 font-semibold">{form.hoursPerDay}h</span>
            </label>
            <input
              type="range" min={1} max={8} step={0.5}
              value={form.hoursPerDay}
              onChange={e => setForm(f => ({ ...f, hoursPerDay: Number(e.target.value) }))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-600 mt-1">
              <span>1h</span><span>4h</span><span>8h</span>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Target size={13} /> Placement deadline
            </label>
            <input type="date" min={minDateStr} value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="input" required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
            {loading ? <><Loader2 size={15} className="animate-spin" />Generating…</> : <><Plus size={15} />Generate my plan</>}
          </button>
        </form>
      </div>
    </div>
  );
}

function TaskRow({ task, onComplete }) {
  const isToday = task.date === new Date().toISOString().split('T')[0];
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
      task.completed
        ? 'border-emerald-500/15 bg-emerald-500/5 opacity-70'
        : isToday
        ? 'border-orange-500/25 bg-orange-500/5'
        : 'border-slate-700/60 hover:border-slate-600/80'
    }`}>
      <button
        onClick={() => !task.completed && onComplete(task._id)}
        className={`shrink-0 transition-colors ${task.completed ? 'text-emerald-400 cursor-default' : 'text-slate-600 hover:text-orange-400'}`}
      >
        {task.completed ? <CheckCircle2 size={17} /> : <Circle size={17} strokeWidth={1.5} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>{task.topic}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {task.rescheduled && <span className="text-[11px] text-amber-500">Rescheduled</span>}
          {isToday && !task.completed && <span className="text-[11px] text-orange-400 font-medium">Today</span>}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-600">
        <span>{task.date}</span>
        <span className="flex items-center gap-1"><Clock size={10} /> {task.duration}m</span>
      </div>
    </div>
  );
}

function DayGroup({ date, tasks, onComplete }) {
  const [open, setOpen] = useState(true);
  const done    = tasks.filter(t => t.completed).length;
  const isToday = date === new Date().toISOString().split('T')[0];
  const label   = isToday ? 'Today' : new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="card mb-3">
      <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full" aria-expanded={open}>
        <div className="flex items-center gap-2.5">
          <span className={`text-[13px] font-semibold ${isToday ? 'text-orange-400' : 'text-slate-300'}`}>{label}</span>
          <span className="text-[11px] text-slate-600">{done}/{tasks.length}</span>
          {done === tasks.length && tasks.length > 0 && (
            <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Done</span>
          )}
        </div>
        {open ? <ChevronUp size={14} className="text-slate-600" /> : <ChevronDown size={14} className="text-slate-600" />}
      </button>
      {open && <div className="space-y-1.5 mt-3">{tasks.map(t => <TaskRow key={t._id} task={t} onComplete={onComplete} />)}</div>}
    </div>
  );
}

export default function Planly() {
  const [plan, setPlan]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const [view, setView]                 = useState('upcoming');

  useEffect(() => {
    getActivePlan().then(r => setPlan(r.data.plan)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleComplete = async (taskId) => {
    try {
      await completeTask(taskId);
      setPlan(prev => ({ ...prev, tasks: prev.tasks.map(t => t._id === taskId ? { ...t, completed: true } : t) }));
    } catch { /* silent */ }
  };

  const handleReschedule = async () => {
    setRescheduling(true);
    try { const { data } = await reschedulePlan(); setPlan(data.plan); } catch { /* silent */ }
    finally { setRescheduling(false); }
  };

  if (loading) return <PageSpinner />;

  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="page-title flex items-center gap-2"><CalendarDays size={19} className="text-orange-400" strokeWidth={1.8} />Planly</h1>
          <p className="page-subtitle">Your personalized day-by-day placement roadmap</p>
        </div>
        <CreatePlanForm onCreated={setPlan} />
      </div>
    );
  }

  const todayStr   = new Date().toISOString().split('T')[0];
  const tasks      = view === 'upcoming' ? plan.tasks.filter(t => t.date >= todayStr) : plan.tasks;
  const byDate     = tasks.reduce((acc, t) => { if (!acc[t.date]) acc[t.date] = []; acc[t.date].push(t); return acc; }, {});
  const dates      = Object.keys(byDate).sort();
  const total      = plan.tasks.length;
  const completed  = plan.tasks.filter(t => t.completed).length;
  const pct        = total > 0 ? Math.round((completed / total) * 100) : 0;
  const missedCount= plan.tasks.filter(t => t.date < todayStr && !t.completed).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2"><CalendarDays size={19} className="text-orange-400" strokeWidth={1.8} />Planly</h1>
          <p className="page-subtitle">{plan.targetCompany} · {plan.targetRole} · {plan.hoursPerDay}h/day</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {missedCount > 0 && (
            <button onClick={handleReschedule} disabled={rescheduling} className="btn-secondary text-[13px] flex items-center gap-1.5 py-1.5">
              {rescheduling ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Reschedule ({missedCount})
            </button>
          )}
          <button onClick={() => setPlan(null)} className="btn-secondary text-[13px] flex items-center gap-1.5 py-1.5">
            <Plus size={13} /> New plan
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2 text-[13px]">
          <span className="text-slate-400 font-medium">Overall progress</span>
          <span className="font-bold text-orange-400">{pct}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-600">
          <span>{completed} done</span>
          <span>Deadline {plan.deadline}</span>
          <span>{total - completed} left</span>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-1.5 bg-slate-800/60 p-1 rounded-xl w-fit">
        {['upcoming', 'all'].map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              view === v ? 'bg-slate-700 text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}>
            {v === 'upcoming' ? 'Upcoming' : 'All tasks'}
          </button>
        ))}
      </div>

      {dates.length === 0
        ? <div className="py-14 text-center"><Zap size={24} className="text-slate-700 mx-auto mb-2" /><p className="text-slate-500 text-[13px]">No tasks to show.</p></div>
        : dates.map(date => <DayGroup key={date} date={date} tasks={byDate[date]} onComplete={handleComplete} />)
      }
    </div>
  );
}
