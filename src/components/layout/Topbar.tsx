import { Bell, ChevronDown, LogOut, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Topbar({ title, onMenuClick }: { title: string; onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const initials = (user?.name || user?.email || 'SA').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          {onMenuClick ? (
            <button type="button" onClick={onMenuClick} className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden">
              <Menu className="h-4 w-4" />
            </button>
          ) : null}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">SamagriApp</p>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </div>
          <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">
            <Bell className="h-4 w-4" />
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">{initials}</div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-800">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-slate-500">{user?.role || 'Administrator'}</p>
              </div>
              <ChevronDown className={`hidden h-4 w-4 text-slate-500 transition sm:block ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileMenuOpen ? (
              <div role="menu" aria-label="Profile options" className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-soft">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => void handleLogout()}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
