import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { PageHeader } from "./PageHeader";
import { Breadcrumbs } from "./Breadcrumbs";
import { Toaster } from "./ui/sonner";

interface NewLayoutProps {
  children: ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
  breadcrumbs?: Array<{ label: string; route?: string }>;
  onLogout?: () => void;
}

export function NewLayout({ children, currentRoute, onNavigate, breadcrumbs = [], onLogout }: NewLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <PageHeader onLogout={onLogout} onNavigate={onNavigate} currentRoute={currentRoute} />
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="px-6 py-3 bg-white border-b border-border">
            <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
          </div>
        )}
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster richColors position="top-right" />
    </div>
  );
}