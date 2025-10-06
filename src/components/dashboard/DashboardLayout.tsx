import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen w-full">
      <Sidebar />
      <Topbar />
      
      <main className="ml-16 pt-16">
        <div className="max-w-[1440px] mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
