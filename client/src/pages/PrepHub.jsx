import { useState, useEffect } from 'react';
import { getSheet, markSolved } from '../api/problems';
import { PageSpinner } from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, Circle, Search, Filter } from 'lucide-react';

const TRACKS = [
  { key: 'dsa',    label: 'DSA (A2Z)',  desc: "Striver's A2Z — 46 problems, 10 steps" },
  { key: 'theory', label: 'CS Theory',  desc: 'OOP · DBMS · OS · CN · SQL' },
  { key: 'lld',    label: 'LLD',        desc: 'Design patterns & system design problems' },
];

const THEORY = [
  { section: 'OOP',              topics: ['Classes & Objects','Inheritance','Polymorphism','Abstraction','Encapsulation','SOLID Principles','Design Patterns'] },
  { section: 'DBMS',             topics: ['ER Model','Normalization (1NF–BCNF)','Transactions & ACID','Indexing','Joins','Stored Procedures','NoSQL vs SQL'] },
  { section: 'Operating Systems',topics: ['Processes & Threads','CPU Scheduling','Memory Management','Deadlocks','Paging & Segmentation','File Systems'] },
  { section: 'Computer Networks',topics: ['OSI / TCP-IP Model','HTTP & HTTPS','DNS & DHCP','TCP vs UDP','Routing Algorithms','Sockets'] },
  { section: 'SQL',              topics: ['SELECT & Filters','Joins (INNER/OUTER)','Aggregations','Subqueries','Window Functions','Indexing & EXPLAIN'] },
];

const LLD = [
  { section: 'Creational',  topics: ['Singleton','Factory','Abstract Factory','Builder','Prototype'] },
  { section: 'Structural',  topics: ['Adapter','Bridge','Decorator','Facade','Proxy'] },
  { section: 'Behavioral',  topics: ['Observer','Strategy','Command','Iterator','Template Method'] },
  { section: 'LLD Problems',topics: ['Design Parking Lot','Library Management','Snake & Ladder','Elevator System','Chess'] },
];

function StepCard({ step, onMark, solvedIds }) {
  const [open, setOpen] = useState(step.step <= 2);
  const done = step.problems.filter(p => solvedIds.has(p.id)).length;
  const allDone = done === step.problems.length;

  return (
    <div className="card mb-2.5">
      <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full" aria-expanded={open}>
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 text-[11px] font-bold flex items-center justify-center shrink-0">
            {step.step}
          </span>
          <div className="text-left">
            <p className="text-[13px] font-semibold text-slate-200">{step.title}</p>
            <p className="text-[11px] text-slate-600">{done}/{step.problems.length} solved</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {allDone && <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Done</span>}
          {open ? <ChevronUp size={14} className="text-slate-600" /> : <ChevronDown size={14} className="text-slate-600" />}
        </div>
      </button>

      {open && (
        <div className="mt-3 space-y-1">
          {step.problems.map(p => {
            const solved = solvedIds.has(p.id);
            return (
              <div key={p.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                solved ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-slate-700/60 hover:border-slate-600/80'
              }`}>
                <button onClick={() => !solved && onMark(p.id)} className={`shrink-0 ${solved ? 'text-emerald-400 cursor-default' : 'text-slate-600 hover:text-orange-400'} transition-colors`}>
                  {solved ? <CheckCircle2 size={16} /> : <Circle size={16} strokeWidth={1.5} />}
                </button>
                <span className={`flex-1 text-[13px] ${solved ? 'line-through text-slate-600' : 'text-slate-300'}`}>{p.topic}</span>
                <Badge difficulty={p.difficulty} />
                <div className="hidden sm:flex items-center gap-1">
                  {p.company?.filter(c => c !== 'All').slice(0,2).map(c => (
                    <span key={c} className="text-[10px] bg-slate-800 text-slate-500 border border-slate-700/60 px-1.5 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TopicGrid({ sections }) {
  return (
    <div className="space-y-4">
      {sections.map(({ section, topics }) => (
        <div key={section} className="card">
          <h3 className="text-[13px] font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
            {section}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {topics.map(t => (
              <div key={t} className="text-[13px] text-slate-400 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">{t}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PrepHub() {
  const [track, setTrack]         = useState('dsa');
  const [sheet, setSheet]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');

  useEffect(() => {
    if (track !== 'dsa') return;
    setLoading(true);
    getSheet('a2z').then(r => setSheet(r.data.sheet || [])).catch(() => {}).finally(() => setLoading(false));
  }, [track]);

  const handleMark = async (id) => {
    try { await markSolved(id); setSolvedIds(prev => new Set([...prev, id])); } catch { /* silent */ }
  };

  const totalProblems = sheet.reduce((a, s) => a + s.problems.length, 0);
  const totalSolved   = solvedIds.size;

  const filteredSheet = sheet.map(step => ({
    ...step,
    problems: step.problems.filter(p => {
      const ms = !search || p.topic.toLowerCase().includes(search.toLowerCase());
      const mf = filter === 'All' || p.difficulty === filter;
      return ms && mf;
    }),
  })).filter(s => s.problems.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2"><BookOpen size={19} className="text-blue-400" strokeWidth={1.8} />Prep Hub</h1>
        <p className="page-subtitle">All your learning tracks in one place</p>
      </div>

      {/* Track tabs */}
      <div className="flex gap-1.5 bg-slate-800/60 p-1 rounded-xl w-fit flex-wrap">
        {TRACKS.map(t => (
          <button key={t.key} onClick={() => setTrack(t.key)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              track === t.key ? 'bg-slate-700 text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-[13px] text-slate-500">{TRACKS.find(t => t.key === track)?.desc}</p>

      {track === 'dsa' && (
        <>
          <div className="card flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="text-slate-400">A2Z Progress</span>
                <span className="font-semibold text-orange-400">{totalSolved}/{totalProblems}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: totalProblems ? `${(totalSolved/totalProblems)*100}%` : '0%' }} />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="input pl-7 py-1.5 text-[13px] w-32" />
              </div>
              <div className="relative">
                <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <select value={filter} onChange={e => setFilter(e.target.value)} className="input pl-7 py-1.5 text-[13px]">
                  {['All','Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
          {loading ? <PageSpinner /> : filteredSheet.map(step => (
            <StepCard key={step.step} step={step} onMark={handleMark} solvedIds={solvedIds} />
          ))}
        </>
      )}
      {track === 'theory' && <TopicGrid sections={THEORY} />}
      {track === 'lld'    && <TopicGrid sections={LLD} />}
    </div>
  );
}
