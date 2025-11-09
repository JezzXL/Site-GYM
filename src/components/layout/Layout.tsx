import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showBadge?: boolean;
  className?: string;
}

export function Layout({ 
  children, 
  showNavbar = true,
  showBadge = false,
  className = '' 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar showBadge={showBadge} />}
      
      <main className={className}>
        {children}
      </main>
    </div>
  );
}

// Layout específico para dashboards com container
export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Layout showNavbar showBadge>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </Layout>
  );
}

// Layout para páginas de autenticação (sem navbar)
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen bg-linear-to-br from-[#6da67a] to-[#4a4857] flex items-center justify-center p-4">
        {children}
      </div>
    </Layout>
  );
}