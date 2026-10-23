import { Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-14 flex items-center px-4 gap-3 sticky top-0 z-10
      bg-[#080e1a]/90 backdrop-blur-md border-b border-slate-800/60">

      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={19} strokeWidth={1.8} />
      </button>

      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search topics, problems…"
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-8 pr-3 py-1.5
              text-[13px] text-slate-300 placeholder:text-slate-600
              focus:outline-none focus:border-orange-500/50 focus:bg-slate-800 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {user && (
          <div className="flex items-center gap-2 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-semibold text-slate-200 leading-tight">{user.name?.split(' ')[0]}</p>
              <p className="text-[11px] text-slate-500 leading-tight">{user.email}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
