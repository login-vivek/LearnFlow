import { useState, useEffect } from 'react';
import * as notesApi from '../api/notes';
import { PageSpinner } from '../components/ui/Spinner';
import { StickyNote, Code2, Plus, Trash2, Pin, PinOff, Search, Loader2, X, Check } from 'lucide-react';

const LANGS = ['java', 'javascript', 'python', 'cpp', 'sql', 'other'];
const NOTE_COLORS = {
  default: 'border-slate-700/60',
  blue:    'border-blue-500/30 bg-blue-500/[0.03]',
  green:   'border-emerald-500/30 bg-emerald-500/[0.03]',
  purple:  'border-violet-500/30 bg-violet-500/[0.03]',
  yellow:  'border-amber-500/30 bg-amber-500/[0.03]',
};
const DOT_COLORS = { default:'bg-slate-600', blue:'bg-blue-400', green:'bg-emerald-400', purple:'bg-violet-400', yellow:'bg-amber-400' };

function NoteCard({ note, onDelete, onPin }) {
  return (
    <div className={`card border ${NOTE_COLORS[note.color] || NOTE_COLORS.default} relative group hover:border-slate-600 transition-colors`}>
      {note.pinned && <Pin size={11} className="absolute top-3 right-3 text-amber-400" />}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-[13px] text-slate-200 flex-1 leading-snug line-clamp-1 pr-4">{note.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => onPin(note)} className="p-1 rounded text-slate-600 hover:text-amber-400 transition-colors"><Pin size={12} /></button>
          <button onClick={() => onDelete(note._id)} className="p-1 rounded text-slate-600 hover:text-rose-400 transition-colors"><Trash2 size={12} /></button>
        </div>
      </div>
      {note.content && <p className="text-[12px] text-slate-500 line-clamp-4 whitespace-pre-wrap leading-relaxed mb-2">{note.content}</p>}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {note.tags.map(t => <span key={t} className="text-[11px] bg-slate-800 text-slate-500 border border-slate-700/60 px-1.5 py-0.5 rounded">{t}</span>)}
        </div>
      )}
    </div>
  );
}

function SnippetCard({ snippet, onDelete, onPin }) {
  return (
    <div className="card border border-slate-700/60 hover:border-slate-600 relative group transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[13px] text-slate-200 line-clamp-1">{snippet.title}</h3>
          {snippet.problem && <p className="text-[11px] text-slate-600 mt-0.5">{snippet.problem}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">{snippet.language}</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onPin(snippet)} className="p-1 rounded text-slate-600 hover:text-amber-400 transition-colors"><Pin size={11} /></button>
            <button onClick={() => onDelete(snippet._id)} className="p-1 rounded text-slate-600 hover:text-rose-400 transition-colors"><Trash2 size={11} /></button>
          </div>
        </div>
      </div>
      <pre className="bg-[#080e1a] border border-slate-800/80 rounded-xl p-3 text-[11px] text-slate-400 overflow-x-auto line-clamp-6">
        {snippet.code || '// No code yet'}
      </pre>
      {snippet.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {snippet.tags.map(t => <span key={t} className="text-[11px] bg-slate-800 text-slate-500 border border-slate-700/60 px-1.5 py-0.5 rounded">{t}</span>)}
        </div>
      )}
    </div>
  );
}

function Modal({ type, onClose, onCreate }) {
  const isNote = type === 'note';
  const [form, setForm] = useState({ title:'', content:'', code:'', language:'java', problem:'', tags:'', color:'default' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const tags = form.tags.split(',').map(t=>t.trim()).filter(Boolean);
      let item;
      if (isNote) { const r = await notesApi.createNote({ title:form.title, content:form.content, tags, color:form.color }); item = r.data.note; }
      else        { const r = await notesApi.createSnippet({ title:form.title, code:form.code, language:form.language, problem:form.problem, tags }); item = r.data.snippet; }
      onCreate(item); onClose();
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-card-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
          <h2 className="font-bold text-[15px] text-white">{isNote ? 'New note' : 'New snippet'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"><X size={15}/></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] text-slate-500 mb-1.5">Title *</label>
            <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder={isNote?'My notes on…':'Two Sum – HashMap'} className="input text-[13px]" required autoFocus />
          </div>
          {isNote ? (
            <>
              <div>
                <label className="block text-[12px] text-slate-500 mb-1.5">Content</label>
                <textarea value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} placeholder="Write your notes…" rows={5} className="input text-[13px] resize-none" />
              </div>
              <div>
                <label className="block text-[12px] text-slate-500 mb-2">Color</label>
                <div className="flex gap-2">
                  {Object.keys(DOT_COLORS).map(c => (
                    <button key={c} type="button" onClick={()=>setForm(f=>({...f,color:c}))}
                      className={`w-5 h-5 rounded-full ${DOT_COLORS[c]} transition-all ${form.color===c?'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110':''}`} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5">Language</label>
                  <select value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))} className="input text-[13px]">
                    {LANGS.map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 mb-1.5">Problem (optional)</label>
                  <input value={form.problem} onChange={e=>setForm(f=>({...f,problem:e.target.value}))} placeholder="Two Sum" className="input text-[13px]" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] text-slate-500 mb-1.5">Code</label>
                <textarea value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} placeholder="// Paste code…" rows={6} className="input text-[12px] resize-none font-mono" />
              </div>
            </>
          )}
          <div>
            <label className="block text-[12px] text-slate-500 mb-1.5">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="Arrays, DP" className="input text-[13px]" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 text-[13px] py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 text-[13px] py-2 flex items-center justify-center gap-1.5">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Notes() {
  const [tab, setTab]           = useState('notes');
  const [notes, setNotes]       = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      notesApi.getNotes().then(r=>setNotes(r.data.notes||[])),
      notesApi.getSnippets().then(r=>setSnippets(r.data.snippets||[])),
    ]).finally(()=>setLoading(false));
  }, []);

  const filteredNotes    = notes.filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase()));
  const filteredSnippets = snippets.filter(s => !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.problem?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {modal && <Modal type={modal} onClose={()=>setModal(null)} onCreate={item => { if(modal==='note') setNotes(p=>[item,...p]); else setSnippets(p=>[item,...p]); }} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2"><StickyNote size={19} className="text-orange-400" strokeWidth={1.8} />Notes & Code</h1>
          <p className="page-subtitle">NoteSpace and CodeSpace — your personal knowledge base</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setModal('note')} className="btn-secondary text-[13px] flex items-center gap-1.5 py-1.5"><Plus size={13}/>Note</button>
          <button onClick={()=>setModal('snippet')} className="btn-primary text-[13px] flex items-center gap-1.5 py-1.5"><Plus size={13}/>Snippet</button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-slate-800/60 p-1 rounded-xl">
          {[{ key:'notes', icon: StickyNote, label:`NoteSpace (${notes.length})` }, { key:'snippets', icon: Code2, label:`CodeSpace (${snippets.length})` }].map(({key,icon:Icon,label})=>(
            <button key={key} onClick={()=>setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${tab===key?'bg-slate-700 text-slate-100 shadow-sm':'text-slate-500 hover:text-slate-300'}`}>
              <Icon size={13}/>{label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-40">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${tab}…`} className="input pl-7 py-1.5 text-[13px] w-full"/>
        </div>
      </div>

      {tab==='notes' && (
        filteredNotes.length===0
          ? <div className="py-16 text-center"><StickyNote size={28} className="text-slate-800 mx-auto mb-3"/><p className="text-[13px] text-slate-500 mb-4">No notes yet.</p><button onClick={()=>setModal('note')} className="btn-primary text-[13px] flex items-center gap-1.5 mx-auto"><Plus size={13}/>Create note</button></div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{filteredNotes.map(n=><NoteCard key={n._id} note={n} onDelete={id=>{ notesApi.deleteNote(id); setNotes(p=>p.filter(n=>n._id!==id)); }} onPin={async n=>{const r=await notesApi.updateNote(n._id,{pinned:!n.pinned}).catch(()=>null);if(r)setNotes(p=>p.map(x=>x._id===n._id?r.data.note:x));}}/>)}</div>
      )}
      {tab==='snippets' && (
        filteredSnippets.length===0
          ? <div className="py-16 text-center"><Code2 size={28} className="text-slate-800 mx-auto mb-3"/><p className="text-[13px] text-slate-500 mb-4">No snippets yet.</p><button onClick={()=>setModal('snippet')} className="btn-primary text-[13px] flex items-center gap-1.5 mx-auto"><Plus size={13}/>Add snippet</button></div>
          : <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{filteredSnippets.map(s=><SnippetCard key={s._id} snippet={s} onDelete={id=>{ notesApi.deleteSnippet(id); setSnippets(p=>p.filter(s=>s._id!==id)); }} onPin={async s=>{const r=await notesApi.updateSnippet(s._id,{pinned:!s.pinned}).catch(()=>null);if(r)setSnippets(p=>p.map(x=>x._id===s._id?r.data.snippet:x));}}/>)}</div>
      )}
    </div>
  );
}
