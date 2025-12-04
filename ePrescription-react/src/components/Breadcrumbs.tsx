import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  route?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (route: string) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      <button
        onClick={() => onNavigate('/dashboard')}
        className="text-blue-100 hover:text-white transition-colors"
        aria-label="Inicio"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-blue-200" />
          {item.route && index < items.length - 1 ? (
            <button
              onClick={() => onNavigate(item.route!)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className={index === items.length - 1 ? 'text-white font-medium' : 'text-blue-100'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}