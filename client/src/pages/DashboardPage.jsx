import React from 'react';
import {
  TrendingUp, Flame, BookOpen, Clock,
  ChevronRight, CheckCircle, Trophy, Lightbulb,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import SkillBar from '../components/ui/SkillBar';
import ProgressRing from '../components/ui/ProgressRing';
import Badge from '../components/ui/Badge';
import {
  mockSkills,
  mockProgress,
  mockRecentActivity,
  mockContinueLearning,
  mockRecommendations,
  mockWeeklyActivity,
} from '../utils/mockData';
import { formatRelativeDate, difficultyBadge } from '../utils/helpers';

/* ── Custom tooltip for the bar chart ── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      <p className="text-primary-600 dark:text-primary-400">{payload[0].value} min</p>
    </div>
  );
}

/* ── Activity type icon ── */
function ActivityIcon({ type }) {
  if (type === 'quiz')
    return <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"><Trophy className="w-4 h-4 text-primary-600 dark:text-primary-400" /></div>;
  return <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /></div>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      {/* ── Welcome ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here's your learning overview for today.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Overall Progress"
          value={`${mockProgress.overall}%`}
          sub="Across all topics"
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />
        <StatCard
          icon={Flame}
          label="Learning Streak"
          value={`${mockProgress.streak} days`}
          sub="Keep it up!"
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-500 dark:text-orange-400"
        />
        <StatCard
          icon={BookOpen}
          label="Topics Studied"
          value={mockProgress.topicsStudied}
          sub="Total topics"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={Clock}
          label="This Week"
          value={`${mockProgress.hoursThisWeek}h`}
          sub="Study time"
          iconBg="bg-violet-100 dark:bg-violet-900/30"
          iconColor="text-violet-600 dark:text-violet-400"
        />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left column — 2/3 width */}
        <div className="xl:col-span-2 space-y-6">

          {/* Continue Learning */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">
              Continue Learning
            </h2>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-primary-100 dark:border-primary-800">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{mockContinueLearning.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Next: {mockContinueLearning.nextLesson}
                    </p>
                  </div>
                  <Badge variant={mockContinueLearning.difficulty.toLowerCase()}>
                    {mockContinueLearning.difficulty}
                  </Badge>
                </div>
                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{mockContinueLearning.progress}% complete</span>
                    <span>{mockContinueLearning.estimatedTime} left</span>
                  </div>
                  <div className="h-1.5 bg-primary-100 dark:bg-primary-900/40 rounded-full">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all"
                      style={{ width: `${mockContinueLearning.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <button className="btn-primary flex-shrink-0 self-center">
                Resume <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">
              Weekly Activity
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={mockWeeklyActivity} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                  {mockWeeklyActivity.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.minutes === Math.max(...mockWeeklyActivity.map(d => d.minutes)) ? '#6366f1' : '#c7d2fe'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendations */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Recommended for You
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                Coming in Phase 4
              </span>
            </div>
            <div className="space-y-3">
              {mockRecommendations.map((rec) => (
                <div key={rec.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{rec.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{rec.reason}</p>
                  </div>
                  <Badge variant={rec.difficulty.toLowerCase()}>{rec.difficulty}</Badge>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — 1/3 width */}
        <div className="space-y-6">

          {/* Overall progress ring */}
          <div className="card p-5 flex flex-col items-center text-center gap-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide self-start w-full">
              Overall Progress
            </h2>
            <ProgressRing percent={mockProgress.overall} size={100} stroke={8} />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {12 - mockProgress.topicsStudied} topics remaining to master
            </p>
          </div>

          {/* Skills overview */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Your Skills
              </h2>
              <a href="/skills" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                View all
              </a>
            </div>
            <div className="space-y-3.5">
              {mockSkills.slice(0, 5).map((skill) => (
                <SkillBar key={skill.name} name={skill.name} score={skill.score} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {mockRecentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <ActivityIcon type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.score !== undefined && (
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{item.score}%</span>
                      )}
                      <span className="text-xs text-slate-400 dark:text-slate-500">{formatRelativeDate(item.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
