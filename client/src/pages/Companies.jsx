import { useState, useEffect } from 'react';
import { getSheet } from '../api/problems';
import { PageSpinner } from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { Building2, Search, TrendingUp, Tag } from 'lucide-react';

const COMPANIES = [
  { key: 'amazon',    name: 'Amazon',    emoji: '🛒', accent: 'border-orange-500/40 bg-orange-500/5 text-orange-400' },
  { key: 'google',    name: 'Google',    emoji: '🔍', accent: 'border-blue-500/40 bg-blue-500/5 text-blue-400' },
  { key: 'microsoft', name: 'Microsoft', emoji: '🪟', accent: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400' },
  { key: 'tcs',       name: 'TCS',       emoji: '💼', accent: 'border-violet-500/40 bg-violet-500/5 text-violet-400' },
];

const FREQ = {
  'Very High': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'High':      'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Medium':    'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function Companies() {
  const [selected, setSelected] = useState('amazon');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [diff, setDiff]         = useState('All');

  useEffect(() => {
    setLoading(true); setSearch(''); setDiff('All');
    getSheet(selected).then(r => setProblems(r.data.problems || [])).catch(() => setProblems([])).finally(() => setLoading(false));
  }, [selected]);

  const filtered = problems.filter(p => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.topic?.toLowerCase().includes(search.toLowerCase());
    return ms && (diff === 'All' || p.difficulty === diff);
  });

  const topicCount = problems.reduce((acc, p) => { acc[p.topic] = (acc[p.topic] || 0) + 1; return acc; }, {});
  const topTopics  = Object.entries(topicCount).sort((a,b) => b[1]-a[1]).slice(0,5);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2"><Building2 size={19} className="text-amber-400" strokeWidth={1.8} />Company Prep</h1>
        <p className="page-subtitle">Questions tagged by company with frequency analysis</p>
      </div>

      {/* Company selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {COMPANIES.map(c => (
          <button key={c.key} onClick={() => setSelected(c.key)}
            className={`card border-2 flex flex-col items-center gap-2 py-4 transition-all hover:-translate-y-0.5 ${
              selected === c.key ? c.accent : 'border-slate-700/60 hover:border-slate-600'
            }`}>
            <span className="text-xl">{c.emoji}</span>
            <span className={`text-[13px] font-semibold ${selected === c.key ? '' : 'text-slate-300'}`}>{c.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 space-y-3">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-36">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search problems…" className="input pl-7 py-1.5 text-[13px] w-full" />
            </div>
            <div className="flex gap-1.5">
              {['All','Easy','Medium','Hard'].map(d => (
                <button key={d} onClick={() => setDiff(d)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${diff === d ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-200'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {loading ? <PageSpinner /> : (
            filtered.length === 0
              ? <div className="py-10 text-center text-[13px] text-slate-500">No problems match.</div>
              : (
                <div className="space-y-1.5">
                  {filtered.map((p, i) => (
                    <div key={p.id} className="card flex items-center gap-3 py-3">
                      <span className="text-[12px] text-slate-700 w-5 shrink-0 text-right">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-slate-200">{p.title}</p>
                        <span className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5"><Tag size={10} />{p.topic}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {p.frequency && (
                          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${FREQ[p.frequency] || 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                            {p.frequency}
                          </span>
                        )}
                        <Badge difficulty={p.difficulty} />
                      </div>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <div className="card">
            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <TrendingUp size={12} /> Top Topics
            </h3>
            <div className="space-y-2.5">
              {topTopics.map(([topic, count]) => (
                <div key={topic}>
                  <div className="flex justify-between text-[12px] text-slate-400 mb-1">
                    <span className="truncate">{topic}</span>
                    <span className="text-slate-600 shrink-0 ml-2">{count}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500/70 rounded-full" style={{ width: problems.length ? `${(count/problems.length)*100}%` : '0' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Stats</h3>
            <div className="space-y-2 text-[13px]">
              {[
                ['Total', problems.length, 'text-slate-200'],
                ['Easy',  problems.filter(p=>p.difficulty==='Easy').length,   'text-emerald-400'],
                ['Medium',problems.filter(p=>p.difficulty==='Medium').length, 'text-amber-400'],
                ['Hard',  problems.filter(p=>p.difficulty==='Hard').length,   'text-rose-400'],
              ].map(([label, val, color]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-slate-500">{label}</span>
                  <span className={`font-semibold ${color}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
