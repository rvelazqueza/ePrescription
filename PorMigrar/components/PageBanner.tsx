import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageBannerProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  action?: ReactNode;
}

export function PageBanner({ 
  icon: Icon, 
  title, 
  description, 
  gradient = "from-blue-600 via-indigo-500 to-purple-600",
  action 
}: PageBannerProps) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${gradient} rounded-lg shadow-lg`}>
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="relative p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">{title}</h1>
              <p className="text-white/90 text-sm">{description}</p>
            </div>
          </div>
          {action && (
            <div className="hidden md:block">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
