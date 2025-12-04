import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DoctorsAPI, SessionAPI, type DoctorProfile } from "../utils/doctorsStore";
import { PrescriptionBookletsAPI, BookletUtils, type BookletType } from "../utils/prescriptionBookletsStore";
import { UserCircle, Stethoscope, Receipt, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface DoctorRoleSelectorProps {
  onDoctorChange?: (doctorId: string) => void;
  showBookletBalance?: boolean;
}

export function DoctorRoleSelector({ 
  onDoctorChange, 
  showBookletBalance = true 
}: DoctorRoleSelectorProps) {
  const [currentDoctor, setCurrentDoctor] = useState<DoctorProfile | null>(
    SessionAPI.getCurrentDoctor()
  );
  const [availableSlips, setAvailableSlips] = useState(0);

  useEffect(() => {
    if (currentDoctor) {
      updateBookletBalance(currentDoctor.id);
    }
  }, [currentDoctor]);

  // Escuchar cambios de doctor desde otros componentes
  useEffect(() => {
    const handleDoctorChange = () => {
      const newDoctor = SessionAPI.getCurrentDoctor();
      setCurrentDoctor(newDoctor);
      if (newDoctor) {
        updateBookletBalance(newDoctor.id);
      }
    };

    window.addEventListener('doctor-changed', handleDoctorChange);
    return () => window.removeEventListener('doctor-changed', handleDoctorChange);
  }, []);

  const updateBookletBalance = (doctorId: string) => {
    const slips = PrescriptionBookletsAPI.getDoctorAvailableSlips(doctorId);
    setAvailableSlips(slips);
  };

  const handleDoctorChange = (doctorId: string) => {
    SessionAPI.setCurrentDoctor(doctorId);
    const doctor = DoctorsAPI.getDoctor(doctorId);
    
    if (doctor) {
      setCurrentDoctor(doctor);
      updateBookletBalance(doctorId);
      
      toast.success("Profesional cambiado", {
        description: `Ahora operando como: ${doctor.name}`,
        duration: 3000,
      });
      
      onDoctorChange?.(doctorId);
    }
  };

  if (!currentDoctor) return null;

  const hasLowBalance = availableSlips > 0 && availableSlips <= 10;
  const hasZeroBalance = availableSlips === 0;

  const doctors = DoctorsAPI.getAllDoctors();

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Información del profesional activo */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <UserCircle className="size-6 text-indigo-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wide text-indigo-600 font-medium">
                  Profesional Activo
                </span>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300 text-xs">
                  {currentDoctor.specialty}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-gray-900 truncate">
                {currentDoctor.name}
              </h3>
              
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Stethoscope className="size-3" />
                  {currentDoctor.license}
                </span>
                
                {showBookletBalance && (
                  <span className="flex items-center gap-1">
                    <Receipt className={`size-3 ${
                      hasZeroBalance ? 'text-red-600' : 
                      hasLowBalance ? 'text-amber-600' : 
                      'text-green-600'
                    }`} />
                    <strong className={
                      hasZeroBalance ? 'text-red-600' : 
                      hasLowBalance ? 'text-amber-600' : 
                      'text-green-600'
                    }>
                      {availableSlips}
                    </strong>
                    <span className="text-gray-500">
                      boleta{availableSlips !== 1 ? 's' : ''}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Selector de profesional */}
          <div className="flex items-center gap-2">
            <Select 
              value={currentDoctor.id} 
              onValueChange={handleDoctorChange}
            >
              <SelectTrigger className="w-[280px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => {
                  const slips = PrescriptionBookletsAPI.getDoctorAvailableSlips(doctor.id);
                  const isLow = slips > 0 && slips <= 10;
                  const isZero = slips === 0;
                  
                  return (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{doctor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {doctor.specialty} · {doctor.license}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          {isZero ? (
                            <AlertTriangle className="size-4 text-red-600" />
                          ) : isLow ? (
                            <AlertTriangle className="size-4 text-amber-600" />
                          ) : (
                            <CheckCircle2 className="size-4 text-green-600" />
                          )}
                          <span className={`text-xs font-medium ${
                            isZero ? 'text-red-600' : 
                            isLow ? 'text-amber-600' : 
                            'text-green-600'
                          }`}>
                            {slips} boletas
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}