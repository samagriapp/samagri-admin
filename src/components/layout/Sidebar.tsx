import { BarChart3, Box, ChevronLeft, LayoutDashboard, LogOut, PlusCircle, ShieldCheck, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Box },
  { to: '/products/new', label: 'Add Product', icon: PlusCircle },
];

export function Sidebar({ open, onClose, collapsed, onToggleCollapsed }: { open?: boolean; onClose?: () => void; collapsed?: boolean; onToggleCollapsed?: () => void }) {
  const { logout } = useAuth();

  const content = (
    <aside className={`flex h-full flex-col border-r border-slate-200 bg-white ${collapsed ? 'w-24' : 'w-72'} transition-all duration-200`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">S</div>
          {!collapsed && <div><p className="font-semibold text-slate-900">SamagriApp</p><p className="text-xs text-slate-500">Admin</p></div>}
        </div>
        {onToggleCollapsed ? (
          <button type="button" onClick={onToggleCollapsed} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
            <ChevronLeft className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-2 px-3 py-5">
        {menuItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'} ${collapsed ? 'justify-center' : ''}`
            }
            onClick={onClose}
          >
            <Icon className="h-4 w-4" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button type="button" onClick={() => void logout()} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 ${collapsed ? 'justify-center' : ''}`}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  if (open !== undefined) {
    return (
      <>
        <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
          {content}
        </div>
        {open ? <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} /> : null}
      </>
    );
  }

  return <div className="hidden lg:block">{content}</div>;
}
