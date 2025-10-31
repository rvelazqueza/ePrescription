import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Bell, Shield, Clock, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { RoleSelector } from "./RoleSelector";

interface TopBarProps {
  doctor: {
    name: string;
    specialty: string;
    avatar?: string;
    license?: string;
    department?: string;
  };
  currentDate: string;
  currentRoute?: string;
}

export function TopBar({ doctor, currentDate, currentRoute = '/dashboard' }: TopBarProps) {
  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Prescripción Electrónica</h2>
          <div className="flex items-center space-x-3 mt-1">
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Sesión Segura
            </Badge>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {currentDate}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Role Selector - Multi-Role System */}
        <RoleSelector 
          currentRoute={currentRoute}
          onRoleChange={(newRole) => {
            console.log('Rol cambiado a:', newRole);
            // Aquí se pueden ejecutar acciones adicionales si es necesario
          }}
        />
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            2
          </span>
        </Button>
        
        {/* Doctor Info */}
        <div className="flex items-center gap-3 border-l pl-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={doctor.avatar} alt={doctor.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="font-medium text-gray-900">{doctor.name}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{doctor.specialty}</span>
              {doctor.license && (
                <>
                  <span>•</span>
                  <span>Lic. {doctor.license}</span>
                </>
              )}
            </div>
            {doctor.department && (
              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                <MapPin className="w-3 h-3 mr-1" />
                {doctor.department}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}