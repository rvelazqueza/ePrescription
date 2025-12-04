import { Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SystemBannerProps {
  className?: string;
}

export function SystemBanner({ className = "" }: SystemBannerProps) {
  return (
    <div className={`relative bg-gradient-to-r from-primary to-primary/90 text-white overflow-hidden ${className}`}>
      {/* Background Medical Image */}
      <div className="absolute inset-0 opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758691462848-ba1e929da259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3NwaXRhbCUyMG1lZGljYWwlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1ODg3MDc4MXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Medical Technology Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">MedFlow Pro</h1>
                <p className="text-white/90 text-sm">Sistema Electrónico de Prescripción Médica</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Compliance Badges */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                HL7 Certified
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Shield className="w-3 h-3 mr-1" />
                FDA Compliant
              </Badge>
            </div>
            
            {/* System Status */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/90">Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}