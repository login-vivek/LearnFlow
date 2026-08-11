import React from 'react';
import { Menu, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6
                        bg-white dark:bg-slate-900
                        border-b border-slate-200 dark:border-slate-700
                        flex-shrink-0">
      {/* Left — mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden btn-ghost p-2 -ml-1"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Right — actions */}
      <div className="flex items-center gap-1 ml-auto">
        <ThemeToggle />

        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg
                     text-slate-500 dark:text-slate-400
                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="ml-1">
          <Avatar name={user?.name} src={user?.avatar} size="sm" />
        </div>
      </div>
    </header>
  );
}
