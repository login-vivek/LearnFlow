import { useState, useEffect } from 'react';
import * as expApi from '../api/experiences';
import { PageSpinner } from '../components/ui/Spinner';
import { Users, Plus, Heart, ChevronDown, ChevronUp, X, Loader2, Check, Building2 } from 'lucide-react';

const RESULT_CHIP = {
  selected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
  pending:  'bg-amber-500/10 text-amber-400 border-amber-500/25',
};
const DIFF_COLOR = { Easy:'text-emerald-400', Medium:'text-amber-400', Hard:'text-rose-400' };

function ExpCard({ exp, onLike }) {
  const [open, setOpen]   = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(exp.likes?.length || 0);

  const handleLike = async () => {
    try { const r = await onLike(exp._id); setLiked(r.liked); setLikes(r.likes); } catch { /* silent */ }
  };

  return (
    <div className="card border border-slate-700/60 hover:border-slate-600/80 transition-colors">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="font-bold text-[15px] text-white">{exp.company}</h3>
            <span className="text-slate-600">·</span>
            <span className="text-[13px] text-slate-400">{exp.role}</span>
            <span className="text-slate-600">·</span>
            <span className="text-[13px] text-slate-500">{exp.year}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium capitalize ${RESULT_CHIP[exp.result]}`}>{exp.result}</span>
            <span className={`text-[12px] font-medium ${DIFF_COLOR[exp.difficulty]}`}>{exp.difficulty}</span>
            <span className="text-[11px] text-slate-600">by {exp.anonymous ? 'Anonymous' : exp.user?.name || 'Unknown'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-[12px] transition-colors ${liked ? 'text-rose-400' : 'text-slate-600 hover:text-rose-400'}`}>
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {likes}
          </button>
          <button onClick={() => setOpen(o => !o)} className="p-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors">
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {exp.overview && <p className="text-[13px] text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">{exp.overview}</p>}

      {open && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
          {exp.rounds?.length > 0 && (
            <div>
              <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Interview rounds</p>
              <div className="space-y-2.5">
                {exp.rounds.map((r, i) => (
                  <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[13px] font-semibold text-slate-200">{r.roundName}</p>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${r.result==='cleared'?'bg-emerald-500/10 text-emerald-400':r.result==='rejected'?'bg-rose-500/10 text-rose-400':'bg-slate-700 text-slate-400'}`}>{r.result}</span>
                    </div>
                    {r.description && <p className="text-[12px] text-slate-500 mb-2">{r.description}</p>}
                    {r.questions?.length > 0 && (
                      <ul className="space-y-1">
                        {r.questions.map((q, j) => (
                          <li key={j} className="text-[12px] text-slate-400 flex gap-2">
                            <span className="text-orange-400 shrink-0">Q{j+1}.</span>{q}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {exp.tips && (
            <div className="bg-orange-500/[0.06] border border-orange-500/15 rounded-xl p-4">
              <p className="text-[11px] font-semibold text-orange-400 mb-1 uppercase tracking-wide">💡 Tips</p>
              <p className="text-[13px] text-slate-300 leading-relaxed">{exp.tips}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    company:'', role:'', year: new Date().getFullYear(),
    result:'pending', difficulty:'Medium', overview:'', tips:'', anonymous:false,
    rounds:[{ roundName:'', description:'', questions:[''], result:'pending' }],
  });
  const [saving, setSaving] = useState(false);

  const addRound    = () => setForm(f => ({ ...f, rounds:[...f.rounds,{roundName:'',description:'',questions:[''],result:'pending'}] }));
  const removeRound = (i) => setForm(f => ({ ...f, rounds:f.rounds.filter((_,idx)=>idx!==i) }));
  const updateRound = (i,k,v) => setForm(f => ({ ...f, rounds:f.rounds.map((r,idx)=>idx===i?{...r,[k]:v}:r) }));
  const addQ        = (i) => setForm(f => ({ ...f, rounds:f.rounds.map((r,idx)=>idx===i?{...r,questions:[...r.questions,'']}:r) }));
  const updateQ     = (ri,qi,v) => setForm(f => ({ ...f, rounds:f.rounds.map((r,idx)=>idx===ri?{...r,questions:r.questions.map((q,qi2)=>qi2===qi?v:q)}:r) }));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {...form, rounds:form.rounds.map(r=>({...r,questions:r.questions.filter(Boolean)}))};
      const r = await expApi.createExperience(payload);
      onCreate(r.data.experience); onClose();
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl my-8 shadow-card-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
          <h2 className="font-bold text-[15px] text-white">Share your experience</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"><X size={15}/></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[12px] text-slate-500 mb-1.5">Company *</label><input value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} placeholder="Amazon" className="input text-[13px]" required/></div>
            <div><label className="block text-[12px] text-slate-500 mb-1.5">Role *</label><input value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} placeholder="SDE-1" className="input text-[13px]" required/></div>
            <div><label className="block text-[12px] text-slate-500 mb-1.5">Year *</label><input type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:Number(e.target.value)}))} className="input text-[13px]" min={2020} max={2030} required/></div>
            <div><label className="block text-[12px] text-slate-500 mb-1.5">Result</label>
              <select value={form.result} onChange={e=>setForm(f=>({...f,result:e.target.value}))} className="input text-[13px]">
                <option value="selected">Selected ✓</option>
                <option value="rejected">Rejected ✗</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] text-slate-500 mb-1.5">Difficulty</label>
            <div className="flex gap-1.5">
              {['Easy','Medium','Hard'].map(d=>(
                <button key={d} type="button" onClick={()=>setForm(f=>({...f,difficulty:d}))}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${form.difficulty===d?'bg-orange-500 text-white':'bg-slate-800 text-slate-500 hover:text-slate-200'}`}>{d}</button>
              ))}
            </div>
          </div>
          <div><label className="block text-[12px] text-slate-500 mb-1.5">Overview</label><textarea value={form.overview} onChange={e=>setForm(f=>({...f,overview:e.target.value}))} placeholder="Brief overview…" rows={3} className="input text-[13px] resize-none"/></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] text-slate-500">Rounds</label>
              <button type="button" onClick={addRound} className="text-[12px] text-orange-400 hover:text-orange-300 flex items-center gap-1"><Plus size={11}/>Add round</button>
            </div>
            <div className="space-y-2.5">
              {form.rounds.map((r,i)=>(
                <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2">
                    <input value={r.roundName} onChange={e=>updateRound(i,'roundName',e.target.value)} placeholder="Round name" className="input text-[12px] flex-1"/>
                    <select value={r.result} onChange={e=>updateRound(i,'result',e.target.value)} className="input text-[12px] w-28">
                      <option value="cleared">Cleared</option><option value="rejected">Rejected</option><option value="pending">Pending</option>
                    </select>
                    {form.rounds.length>1 && <button type="button" onClick={()=>removeRound(i)} className="text-slate-600 hover:text-rose-400 p-1"><X size={12}/></button>}
                  </div>
                  <textarea value={r.description} onChange={e=>updateRound(i,'description',e.target.value)} placeholder="What happened…" rows={2} className="input text-[12px] resize-none w-full"/>
                  <div className="space-y-1">
                    {r.questions.map((q,qi)=>(
                      <input key={qi} value={q} onChange={e=>updateQ(i,qi,e.target.value)} placeholder={`Question ${qi+1}`} className="input text-[12px] w-full"/>
                    ))}
                    <button type="button" onClick={()=>addQ(i)} className="text-[11px] text-slate-600 hover:text-orange-400 transition-colors">+ question</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div><label className="block text-[12px] text-slate-500 mb-1.5">Tips</label><textarea value={form.tips} onChange={e=>setForm(f=>({...f,tips:e.target.value}))} placeholder="What helped you?" rows={2} className="input text-[13px] resize-none"/></div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.anonymous} onChange={e=>setForm(f=>({...f,anonymous:e.target.checked}))} className="w-4 h-4 accent-orange-500"/>
            <span className="text-[13px] text-slate-400">Post anonymously</span>
          </label>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 text-[13px] py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 text-[13px] py-2 flex items-center justify-center gap-1.5">
              {saving?<Loader2 size={13} className="animate-spin"/>:<Check size={13}/>}
              {saving?'Posting…':'Post experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(false);
  const [filter, setFilter]           = useState({ company:'', result:'' });
  const [total, setTotal]             = useState(0);

  const load = (f=filter) => {
    setLoading(true);
    expApi.getExperiences({ company:f.company||undefined, result:f.result||undefined })
      .then(r=>{ setExperiences(r.data.experiences||[]); setTotal(r.data.total||0); })
      .catch(()=>{}).finally(()=>setLoading(false));
  };

  useEffect(()=>{load();},[]);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {modal && <CreateModal onClose={()=>setModal(false)} onCreate={e=>{setExperiences(p=>[e,...p]);setTotal(t=>t+1);}}/>}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2"><Users size={19} className="text-cyan-400" strokeWidth={1.8}/>Interview Experiences</h1>
          <p className="page-subtitle">{total} experiences from the community</p>
        </div>
        <button onClick={()=>setModal(true)} className="btn-primary flex items-center gap-1.5 text-[13px]"><Plus size={13}/>Share mine</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <Building2 size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600"/>
          <input value={filter.company} onChange={e=>setFilter(f=>({...f,company:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&load()} placeholder="Filter by company…" className="input pl-7 py-1.5 text-[13px] w-44"/>
        </div>
        <select value={filter.result} onChange={e=>{const v={...filter,result:e.target.value};setFilter(v);load(v);}} className="input py-1.5 text-[13px] w-36">
          <option value="">All results</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
        <button onClick={()=>load()} className="btn-secondary text-[13px] py-1.5 px-4">Search</button>
      </div>

      {loading ? <PageSpinner /> : (
        experiences.length===0
          ? <div className="py-14 text-center"><Users size={28} className="text-slate-800 mx-auto mb-3"/><p className="text-[13px] text-slate-500 mb-4">No experiences yet.</p><button onClick={()=>setModal(true)} className="btn-primary text-[13px]">Be the first</button></div>
          : <div className="space-y-3">{experiences.map(e=><ExpCard key={e._id} exp={e} onLike={async id=>{const r=await expApi.likeExperience(id);return r.data;}}/>)}</div>
      )}
    </div>
  );
}
