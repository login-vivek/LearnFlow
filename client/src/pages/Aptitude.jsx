import { useState, useEffect } from 'react';
import { getAptitudeQuestions, submitAptitude } from '../api/aptitude';
import { PageSpinner } from '../components/ui/Spinner';
import { Calculator, CheckCircle2, XCircle, RefreshCw, Trophy, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { key:'quantitative', label:'Quantitative', emoji:'🔢', desc:'Percentages, profit/loss, time & work' },
  { key:'logical',      label:'Logical',      emoji:'🧩', desc:'Series, blood relations, syllogisms' },
  { key:'verbal',       label:'Verbal',       emoji:'📝', desc:'Synonyms, grammar, comprehension' },
];

function ResultScreen({ results, score, total, onRetry }) {
  const pct = Math.round((score / total) * 100);
  const grade = pct >= 80 ? { label:'Excellent!', color:'text-emerald-400' }
              : pct >= 60 ? { label:'Good job',   color:'text-amber-400' }
              : { label:'Keep practising', color:'text-rose-400' };

  return (
    <div className="space-y-4">
      <div className="card text-center py-8">
        <Trophy size={32} className={`mx-auto mb-3 ${pct >= 60 ? 'text-amber-400' : 'text-slate-600'}`} strokeWidth={1.5} />
        <p className="text-4xl font-extrabold text-white mb-1">{score}/{total}</p>
        <p className={`text-base font-semibold ${grade.color}`}>{grade.label}</p>
        <p className="text-[12px] text-slate-500 mt-1">{pct}% correct</p>
        <div className="w-48 mx-auto mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full" style={{ width:`${pct}%` }}/>
        </div>
      </div>

      <div className="space-y-2.5">
        {results.map((r,i) => (
          <div key={r.id} className={`card border ${r.correct?'border-emerald-500/20 bg-emerald-500/[0.04]':'border-rose-500/20 bg-rose-500/[0.04]'}`}>
            <div className="flex items-start gap-3">
              <div className={`shrink-0 mt-0.5 ${r.correct?'text-emerald-400':'text-rose-400'}`}>
                {r.correct ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-slate-200 mb-1">Q{i+1}. {r.question}</p>
                {!r.correct && (
                  <p className="text-[12px] text-slate-500">
                    Your answer: <span className="text-rose-400">{r.options?.[r.selected]??'—'}</span>
                    {' · '}Correct: <span className="text-emerald-400">{r.options?.[r.correctAnswer]}</span>
                  </p>
                )}
                {r.explanation && (
                  <p className="text-[12px] text-slate-600 mt-1 bg-slate-800/60 rounded-lg px-2.5 py-1.5">{r.explanation}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onRetry} className="btn-primary w-full flex items-center justify-center gap-2">
        <RefreshCw size={14}/> Try another set
      </button>
    </div>
  );
}

export default function Aptitude() {
  const [category, setCategory]     = useState('quantitative');
  const [questions, setQuestions]   = useState([]);
  const [answers, setAnswers]       = useState({});
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults]       = useState(null);
  const [score, setScore]           = useState(0);

  const loadQ = async (cat=category) => {
    setLoading(true); setResults(null); setAnswers({});
    try { const r = await getAptitudeQuestions({ category:cat, limit:8 }); setQuestions(r.data.questions||[]); }
    catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { loadQ(); }, []);

  const handleCat = (cat) => { setCategory(cat); loadQ(cat); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([id,selected])=>({id,selected}));
      const r = await submitAptitude({ answers:payload, category });
      const qMap = Object.fromEntries(questions.map(q=>[q.id,q]));
      const enriched = (r.data.results||[]).map(res=>({...res, question:qMap[res.id]?.question, options:qMap[res.id]?.options}));
      setResults(enriched); setScore(r.data.score);
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  const answered   = Object.keys(answers).length;
  const canSubmit  = answered === questions.length && questions.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2"><Calculator size={19} className="text-violet-400" strokeWidth={1.8}/>Aptitude Prep</h1>
        <p className="page-subtitle">Quantitative · Logical · Verbal — placement test practice</p>
      </div>

      {!results && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={()=>handleCat(c.key)}
              className={`card border-2 text-left transition-all hover:-translate-y-0.5 ${category===c.key?'border-orange-500/50 bg-orange-500/[0.05]':'border-slate-700/60 hover:border-slate-600'}`}>
              <span className="text-xl mb-2 block">{c.emoji}</span>
              <p className="text-[13px] font-semibold text-slate-200 mb-0.5">{c.label}</p>
              <p className="text-[12px] text-slate-500">{c.desc}</p>
            </button>
          ))}
        </div>
      )}

      {results && (
        <ResultScreen results={results} score={score} total={questions.length} onRetry={()=>loadQ(category)}/>
      )}

      {!results && (
        loading ? <PageSpinner /> : (
          <div className="space-y-3">
            {answered > 0 && (
              <div className="flex items-center gap-3 text-[12px] text-slate-500">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width:`${(answered/questions.length)*100}%` }}/>
                </div>
                <span>{answered}/{questions.length}</span>
              </div>
            )}

            {questions.map((q, i) => (
              <div key={q.id} className={`card border transition-colors ${answers[q.id]!==undefined?'border-orange-500/25':'border-slate-700/60'}`}>
                <p className="text-[13px] font-semibold text-slate-200 mb-3 leading-relaxed">
                  <span className="text-orange-400 mr-2">Q{i+1}.</span>{q.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options?.map((opt, oi) => (
                    <button key={oi} onClick={()=>setAnswers(a=>({...a,[q.id]:oi}))}
                      className={`text-left px-3 py-2.5 rounded-xl text-[13px] border transition-all ${
                        answers[q.id]===oi
                          ? 'border-orange-500/50 bg-orange-500/10 text-orange-300'
                          : 'border-slate-700/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800/40'
                      }`}>
                      <span className="font-mono text-[11px] text-slate-600 mr-2">{String.fromCharCode(65+oi)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {questions.length > 0 && (
              <button onClick={handleSubmit} disabled={!canSubmit||submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-40">
                {submitting ? <><Loader2 size={15} className="animate-spin"/>Checking…</>
                  : canSubmit ? 'Submit answers'
                  : `Answer all ${questions.length} questions to submit`}
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}
