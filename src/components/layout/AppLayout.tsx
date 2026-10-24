import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} />
      <div className="flex w-full flex-1 flex-col">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
