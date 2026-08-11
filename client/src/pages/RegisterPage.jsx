import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/ui/Spinner';

export default function RegisterPage() {
  const { register } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())             e.name    = 'Name is required';
    if (!form.email.trim())            e.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)                e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword)         e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      addToast('Account created! Welcome to LearnFlow.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      addToast(err.userMessage || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ id, label, type = 'text', autoComplete, showToggle, show, onToggle, placeholder, error }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={showToggle ? (show ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          value={form[id]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input-base ${showToggle ? 'pr-10' : ''} ${error ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={show ? 'Hide' : 'Show'}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="card p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start your personalized learning journey</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field id="name"            label="Full name"        autoComplete="name"            placeholder="Jane Smith"      error={errors.name} />
        <Field id="email"           label="Email address"    type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} />
        <Field id="password"        label="Password"         showToggle show={showPass}    onToggle={() => setShowPass(v => !v)}    placeholder="Min. 6 characters" error={errors.password} />
        <Field id="confirmPassword" label="Confirm password" showToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} placeholder="Repeat your password"  error={errors.confirmPassword} />

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
          {loading ? <Spinner size="sm" /> : <UserPlus className="w-4 h-4" />}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
