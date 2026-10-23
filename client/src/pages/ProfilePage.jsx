import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Target, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import userService from '../services/userService';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const FORMAT_OPTIONS = ['video', 'article', 'interactive', 'quiz', 'podcast'];

const GOAL_SUGGESTIONS = [
  'Get a software engineering job',
  'Ace coding interviews',
  'Learn data structures',
  'Improve problem-solving',
  'Study for competitive programming',
  'Build personal projects',
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const addToast = useToast();

  const [form, setForm] = useState({
    name: '',
    avatar: '',
    learningGoals: [],
    preferredFormats: [],
  });
  const [goalInput, setGoalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  // Load fresh profile from API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await userService.getProfile();
        const u = data.user;
        setForm({
          name: u.name || '',
          avatar: u.avatar || '',
          learningGoals: u.learningGoals || [],
          preferredFormats: u.preferredFormats || [],
        });
      } catch (err) {
        setPageError(err.userMessage || 'Unable to load your profile.');
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, []);

  const toggleFormat = (fmt) => {
    setForm((prev) => ({
      ...prev,
      preferredFormats: prev.preferredFormats.includes(fmt)
        ? prev.preferredFormats.filter((f) => f !== fmt)
        : [...prev.preferredFormats, fmt],
    }));
  };

  const addGoal = (goal) => {
    const trimmed = goal.trim();
    if (trimmed && !form.learningGoals.includes(trimmed)) {
      setForm((prev) => ({ ...prev, learningGoals: [...prev.learningGoals, trimmed] }));
    }
    setGoalInput('');
  };

  const removeGoal = (goal) => {
    setForm((prev) => ({
      ...prev,
      learningGoals: prev.learningGoals.filter((g) => g !== goal),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      addToast('Name cannot be empty.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const { data } = await userService.updateProfile(form);
      updateUser(data.user);
      addToast('Profile updated successfully.', 'success');
    } catch (err) {
      addToast(err.userMessage || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (pageError) {
    return <ErrorMessage message={pageError} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account information and learning preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar + name section */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-5">
            Personal Information
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <Avatar name={form.name || user?.name} src={form.avatar} size="xl" />
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <User className="inline w-3.5 h-3.5 mr-1 opacity-70" />
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="input-base"
                placeholder="Your full name"
              />
            </div>

            {/* Email — read-only */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <Mail className="inline w-3.5 h-3.5 mr-1 opacity-70" />
                Email address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-base opacity-60 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Email cannot be changed in Phase 1.</p>
            </div>

            {/* Avatar URL */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Avatar URL
              </label>
              <input
                id="avatar"
                type="url"
                value={form.avatar}
                onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))}
                className="input-base"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
        </div>

        {/* Learning preferences */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-5">
            Learning Preferences
          </h2>

          {/* Preferred formats */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Monitor className="inline w-3.5 h-3.5 mr-1 opacity-70" />
              Preferred formats
            </label>
            <div className="flex flex-wrap gap-2">
              {FORMAT_OPTIONS.map((fmt) => {
                const active = form.preferredFormats.includes(fmt);
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => toggleFormat(fmt)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize
                      ${active
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500'
                      }`}
                  >
                    {fmt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Learning goals */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Target className="inline w-3.5 h-3.5 mr-1 opacity-70" />
              Learning goals
            </label>

            {/* Existing goals */}
            {form.learningGoals.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.learningGoals.map((goal) => (
                  <span key={goal} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    {goal}
                    <button
                      type="button"
                      onClick={() => removeGoal(goal)}
                      className="hover:text-primary-900 dark:hover:text-primary-100 text-primary-500"
                      aria-label={`Remove goal: ${goal}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add goal input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGoal(goalInput); }}}
                placeholder="Add a learning goal…"
                className="input-base flex-1"
              />
              <button
                type="button"
                onClick={() => addGoal(goalInput)}
                className="btn-secondary px-3"
                disabled={!goalInput.trim()}
              >
                Add
              </button>
            </div>

            {/* Suggestions */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {GOAL_SUGGESTIONS.filter((g) => !form.learningGoals.includes(g)).slice(0, 4).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => addGoal(g)}
                  className="text-xs px-2.5 py-1 rounded-full border border-dashed border-slate-300 dark:border-slate-600
                             text-slate-500 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  + {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save */}
        <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
          {loading ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
