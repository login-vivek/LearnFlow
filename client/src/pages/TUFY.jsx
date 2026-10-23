import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { askTUFY, getHint, reviewCode, generateNotes } from '../api/ai';
import { Bot, Send, Lightbulb, Code2, FileText, Loader2, User, Trash2 } from 'lucide-react';

const MODES = [
  { key: 'ask',    icon: Bot,       label: 'Ask',         placeholder: 'Explain binary search with Java…',          color: 'text-violet-400' },
  { key: 'hint',   icon: Lightbulb, label: 'Hint',        placeholder: 'I\'m stuck on Two Sum…',                    color: 'text-amber-400' },
  { key: 'review', icon: Code2,     label: 'Code Review', placeholder: 'public int[] twoSum(int[] nums…',           color: 'text-blue-400' },
  { key: 'notes',  icon: FileText,  label: 'Gen Notes',   placeholder: 'Dynamic Programming, Binary Trees…',        color: 'text-emerald-400' },
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        isUser ? 'bg-orange-500/20 text-orange-400' : 'bg-violet-500/20 text-violet-400'
      }`}>
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>
      <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
        isUser
          ? 'bg-orange-500/10 border border-orange-500/20 text-slate-200 rounded-tr-sm'
          : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-sm'
      }`}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-slate-100 prose-headings:font-semibold
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-code:text-orange-300 prose-code:bg-slate-900/80 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.82em]
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700/60 prose-pre:rounded-xl
            prose-strong:text-slate-100 prose-li:text-slate-300">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TUFY() {
  const [mode, setMode]         = useState('ask');
  const [input, setInput]       = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm TUFY — your AI prep partner. Ask me to explain concepts, give hints, review code, or generate revision notes. What are we working on?" }
  ]);
  const [loading, setLoading]   = useState(false);
  const bottomRef  = useRef(null);
  const currentMode = MODES.find(m => m.key === mode);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      let res = '';
      if (mode === 'ask')    res = (await askTUFY(text)).data.answer;
      if (mode === 'hint')   res = (await getHint(text)).data.hint;
      if (mode === 'review') res = (await reviewCode(text)).data.review;
      if (mode === 'notes')  res = (await generateNotes(text)).data.notes;
      setMessages(prev => [...prev, { role: 'assistant', content: res }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Something went wrong. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-7.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="page-title flex items-center gap-2"><Bot size={19} className="text-violet-400" strokeWidth={1.8} />TUFY AI</h1>
          <p className="page-subtitle">Your 24/7 AI prep assistant</p>
        </div>
        <button onClick={() => setMessages([{ role: 'assistant', content: "Chat cleared! What would you like to work on?" }])}
          className="btn-ghost p-2" aria-label="Clear">
          <Trash2 size={15} className="text-slate-500 hover:text-rose-400 transition-colors" />
        </button>
      </div>

      {/* Mode pills */}
      <div className="flex gap-1.5 mb-4 shrink-0 flex-wrap">
        {MODES.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
              mode === m.key
                ? 'bg-slate-700 border-slate-600 text-slate-100'
                : 'bg-transparent border-slate-800/80 text-slate-500 hover:border-slate-700 hover:text-slate-300'
            }`}>
            <m.icon size={12} className={mode === m.key ? m.color : ''} />
            {m.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-0.5">
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
              <Bot size={13} className="text-violet-400" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={13} className="animate-spin text-violet-400" />
              <span className="text-[13px] text-slate-500">TUFY is thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 pt-3 border-t border-slate-800/60">
        <div className="flex items-start gap-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-2 focus-within:border-orange-500/40 transition-colors">
          <currentMode.icon size={14} className={`${currentMode.color} mt-2.5 ml-1 shrink-0`} />
          <textarea
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={currentMode.placeholder} rows={2}
            className="flex-1 bg-transparent text-[13px] text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none leading-relaxed"
          />
          <button onClick={handleSend} disabled={!input.trim() || loading}
            className="shrink-0 w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
            {loading ? <Loader2 size={13} className="animate-spin text-white" /> : <Send size={13} className="text-white" />}
          </button>
        </div>
        <p className="text-[11px] text-slate-700 mt-1.5 ml-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
