import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleSuggestionService {
  private showModalSubject = new BehaviorSubject<boolean>(false);
  public showModal$ = this.showModalSubject.asObservable();

  private dismissedPagesSubject = new BehaviorSubject<Map<string, string>>(new Map());
  public dismissedPages$ = this.dismissedPagesSubject.asObservable();

  constructor() {}

  /**
   * Mostrar el modal de sugerencia de rol
   */
  showRoleSuggestionModal(): void {
    this.showModalSubject.next(true);
  }

  /**
   * Ocultar el modal de sugerencia de rol
   */
  hideRoleSuggestionModal(): void {
    this.showModalSubject.next(false);
  }

  /**
   * Marcar una página como descartada para el rol actual
   */
  dismissForPage(pageName: string, currentRole: string): void {
    const currentDismissed = this.dismissedPagesSubject.value;
    const newDismissed = new Map(currentDismissed);
    newDismissed.set(pageName, currentRole);
    this.dismissedPagesSubject.next(newDismissed);
  }

  /**
   * Verificar si una página fue descartada para el rol actual
   */
  isPageDismissed(pageName: string, currentRole: string): boolean {
    const dismissedRole = this.dismissedPagesSubject.value.get(pageName);
    return dismissedRole === currentRole;
  }

  /**
   * Limpiar páginas descartadas (útil cuando cambia el rol)
   */
  clearDismissedPages(): void {
    this.dismissedPagesSubject.next(new Map());
  }

  /**
   * Limpiar descarte para una página específica
   */
  clearDismissedForPage(pageName: string): void {
    const currentDismissed = this.dismissedPagesSubject.value;
    const newDismissed = new Map(currentDismissed);
    newDismissed.delete(pageName);
    this.dismissedPagesSubject.next(newDismissed);
  }
}