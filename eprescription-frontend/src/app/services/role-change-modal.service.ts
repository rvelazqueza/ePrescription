import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRole } from './role-demo.service';

export interface RoleChangeModalState {
  isOpen: boolean;
  currentRole: UserRole;
  newRole: UserRole;
  context?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleChangeModalService {
  private modalStateSubject = new BehaviorSubject<RoleChangeModalState>({
    isOpen: false,
    currentRole: 'Médico',
    newRole: 'Médico'
  });

  public modalState$: Observable<RoleChangeModalState> = this.modalStateSubject.asObservable();

  constructor() {}

  /**
   * Abre el modal de confirmación de cambio de rol
   */
  openRoleChangeModal(currentRole: UserRole, newRole: UserRole, context?: string): void {
    // No abrir modal si es el mismo rol
    if (currentRole === newRole) {
      return;
    }

    this.modalStateSubject.next({
      isOpen: true,
      currentRole,
      newRole,
      context
    });
  }

  /**
   * Cierra el modal de confirmación de cambio de rol
   */
  closeRoleChangeModal(): void {
    const currentState = this.modalStateSubject.value;
    this.modalStateSubject.next({
      ...currentState,
      isOpen: false
    });
  }

  /**
   * Obtiene el estado actual del modal
   */
  getCurrentState(): RoleChangeModalState {
    return this.modalStateSubject.value;
  }
}