import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, CalendarDays, BookOpen, Building2,
  Bot, Trophy, StickyNote, TrendingUp, Users, Calculator,
  LogOut, Flame, Zap
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/planly',      icon: CalendarDays,    label: 'Planly' },
  { to: '/prep-hub',    icon: BookOpen,        label: 'Prep Hub' },
  { to: '/companies',   icon: Building2,       label: 'Companies' },
  { to: '/tufy',        icon: Bot,             label: 'TUFY AI' },
  { to: '/potd',        icon: Trophy,          label: 'POTD' },
  { to: '/notes',       icon: StickyNote,      label: 'Notes & Code' },
  { to: '/progress',    icon: TrendingUp,      label: 'Progress' },
  { to: '/experiences', icon: Users,           label: 'Experiences' },
  { to: '/aptitude',    icon: Calculator,      label: 'Aptitude' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-60 z-30 flex flex-col
        bg-slate-900 border-r border-slate-800/80
        transition-transform duration-300 ease-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-slate-800/80 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-glow">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-[15px] text-white tracking-tight">LearnFlow</span>
        </div>

        {/* User chip */}
        {user && (
          <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-100 truncate leading-tight">{user.name}</p>
              <div className="flex items-center gap-1 text-orange-400 text-[11px] mt-0.5">
                <Flame size={10} />
                <span>{user.streak || 0} day streak</span>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-100 group
                ${isActive
                  ? 'bg-orange-500/[0.12] text-orange-400'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={15}
                    className={`shrink-0 transition-colors ${isActive ? 'text-orange-400' : 'text-slate-600 group-hover:text-slate-400'}`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span>{label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-3 pt-2 border-t border-slate-800/80 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all"
          >
            <LogOut size={15} strokeWidth={1.8} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
