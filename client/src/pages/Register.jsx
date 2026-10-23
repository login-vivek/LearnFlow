import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const pwStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthMeta = [
    null,
    { label: 'Too weak',  color: 'bg-rose-500' },
    { label: 'Weak',      color: 'bg-amber-500' },
    { label: 'Fair',      color: 'bg-amber-400' },
    { label: 'Good',      color: 'bg-emerald-500' },
    { label: 'Strong',    color: 'bg-emerald-400' },
  ][pwStrength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password needs at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080e1a] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-glow">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-[15px] text-white tracking-tight">LearnFlow</span>
        </Link>

        <div className="card-elevated px-6 py-7">
          <h1 className="text-lg font-bold text-white mb-0.5">Create your account</h1>
          <p className="text-sm text-slate-500 mb-6">Start your placement prep — free forever</p>

          {error && (
            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-slate-400 mb-1.5">Full name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="Rahul Sharma"
                className="input" required autoFocus
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-400 mb-1.5">Email address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className="input" required
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min. 6 characters"
                  className="input pr-10" required
                />
                <button
                  type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwStrength ? strengthMeta?.color : 'bg-slate-700'}`} />
                    ))}
                  </div>
                  {strengthMeta && <p className="text-[11px] text-slate-500 mt-1">{strengthMeta.label}</p>}
                </div>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 mt-1"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" />Creating account…</> : 'Create account'}
            </button>
          </form>

          <p className="text-[13px] text-slate-500 text-center mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
