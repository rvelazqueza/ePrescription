import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Calendar,
  FileText,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Stethoscope,
  Syringe,
  Heart,
  FileCheck
} from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: "prescription" | "visit" | "diagnosis" | "allergy" | "vaccination" | "lab" | "procedure";
  title: string;
  description: string;
  doctor?: string;
  status?: "completed" | "pending" | "cancelled";
}

interface MedicalTimelineProps {
  events: TimelineEvent[];
}

const eventConfig = {
  prescription: {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    label: "Prescripción"
  },
  visit: {
    icon: Stethoscope,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    label: "Consulta"
  },
  diagnosis: {
    icon: Activity,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    label: "Diagnóstico"
  },
  allergy: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    label: "Alergia"
  },
  vaccination: {
    icon: Syringe,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-300",
    label: "Vacunación"
  },
  lab: {
    icon: FileCheck,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300",
    label: "Laboratorio"
  },
  procedure: {
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-300",
    label: "Procedimiento"
  }
};

export function MedicalTimeline({ events }: MedicalTimelineProps) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const config = eventConfig[event.type];
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative">
            {/* Línea vertical */}
            {!isLast && (
              <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200" />
            )}

            <div className="flex gap-4">
              {/* Icono */}
              <div className={`relative z-10 flex-shrink-0 w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center border-2 ${config.borderColor}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>

              {/* Contenido */}
              <Card className="flex-1 border-l-4" style={{ borderLeftColor: config.bgColor.replace('bg-', 'var(--color-').replace('-100', '-300)') }}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`${config.bgColor} ${config.color} border-0`}>
                          {config.label}
                        </Badge>
                        {event.status && (
                          <Badge 
                            variant="outline" 
                            className={
                              event.status === 'completed' 
                                ? 'bg-green-100 text-green-700 border-green-300' 
                                : event.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }
                          >
                            {event.status === 'completed' ? 'Completado' : event.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      {event.doctor && (
                        <p className="text-xs text-gray-500 mt-2">
                          <Stethoscope className="w-3 h-3 inline mr-1" />
                          {event.doctor}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 text-sm text-gray-600 ml-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
}