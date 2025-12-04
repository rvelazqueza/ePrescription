import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'Médico' | 'Farmacéutico' | 'Enfermera' | 'Administrador' | 'Médico Jefe';

export interface RoleSession {
  activeRole: UserRole;
  isDemoMode: boolean;
  assignedRoles: UserRole[];
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleDemoService {
  private readonly STORAGE_KEY = 'eprescription_demo_session';
  
  private currentSessionSubject = new BehaviorSubject<RoleSession>(this.loadSessionFromStorage());

  public currentSession$ = this.currentSessionSubject.asObservable();

  constructor() {
    // TEMPORAL: Limpiar localStorage para testing
    localStorage.removeItem(this.STORAGE_KEY);
    
    // Escuchar eventos de cambio de rol desde el top-bar
    window.addEventListener('roleChanged', (event: any) => {
      this.changeRole(this.mapRoleFromTopBar(event.detail.role));
    });
  }

  private loadSessionFromStorage(): RoleSession {
    try {
      const savedSession = localStorage.getItem(this.STORAGE_KEY);
      
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        
        // Validar que la sesión guardada tenga la estructura correcta
        if (parsed && parsed.activeRole && parsed.assignedRoles && parsed.fullName) {
          return {
            activeRole: parsed.activeRole,
            isDemoMode: parsed.isDemoMode || false,
            assignedRoles: parsed.assignedRoles,
            fullName: parsed.fullName
          };
        }
      }
    } catch (error) {
      console.warn('Error loading session from storage:', error);
    }

    // Retornar sesión por defecto si no hay nada guardado o hay error
    return {
      activeRole: 'Médico Jefe' as UserRole,
      isDemoMode: false,
      assignedRoles: ['Médico', 'Farmacéutico', 'Enfermera', 'Administrador', 'Médico Jefe'] as UserRole[],
      fullName: 'Dr. Juan Pérez'
    };
  }

  private saveSessionToStorage(session: RoleSession): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.warn('Error saving session to storage:', error);
    }
  }

  private mapRoleFromTopBar(role: string): UserRole {
    switch (role.toLowerCase()) {
      case 'medico':
        return 'Médico';
      case 'farmaceutico':
        return 'Farmacéutico';
      case 'administrador':
        return 'Administrador';
      case 'medico jefe':
      case 'medicojefe':
        return 'Médico Jefe';
      default:
        return 'Médico';
    }
  }

  changeRole(newRole: UserRole): void {
    const currentSession = this.currentSessionSubject.value;
    const updatedSession = {
      ...currentSession,
      activeRole: newRole,
      isDemoMode: true
    };
    
    // Guardar en localStorage
    this.saveSessionToStorage(updatedSession);
    
    // Actualizar el BehaviorSubject
    this.currentSessionSubject.next(updatedSession);
  }

  getCurrentSession(): RoleSession {
    return this.currentSessionSubject.value;
  }

  resetDemoMode(): void {
    const currentSession = this.currentSessionSubject.value;
    const updatedSession = {
      ...currentSession,
      isDemoMode: false
    };
    
    // Guardar en localStorage
    this.saveSessionToStorage(updatedSession);
    
    // Actualizar el BehaviorSubject
    this.currentSessionSubject.next(updatedSession);
  }

  clearSession(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Error clearing session from storage:', error);
    }
    
    // Resetear a valores por defecto
    const defaultSession = {
      activeRole: 'Médico' as UserRole,
      isDemoMode: false,
      assignedRoles: ['Médico', 'Farmacéutico', 'Enfermera', 'Administrador', 'Médico Jefe'] as UserRole[],
      fullName: 'Dr. Juan Pérez'
    };
    
    this.currentSessionSubject.next(defaultSession);
  }
}