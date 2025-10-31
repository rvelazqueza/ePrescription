import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RoleChangeConfirmationModalComponent } from '../role-change-confirmation-modal/role-change-confirmation-modal.component';
import { RoleChangeModalService, RoleChangeModalState } from '../../services/role-change-modal.service';
import { RoleDemoService, UserRole } from '../../services/role-demo.service';

@Component({
  selector: 'app-global-role-change-modal',
  standalone: true,
  imports: [CommonModule, RoleChangeConfirmationModalComponent],
  template: `
    <app-role-change-confirmation-modal
      [isOpen]="modalState.isOpen"
      [currentRole]="modalState.currentRole"
      [newRole]="modalState.newRole"
      (confirm)="onRoleChangeConfirm($event)"
      (cancel)="onRoleChangeCancel()">
    </app-role-change-confirmation-modal>
  `
})
export class GlobalRoleChangeModalComponent implements OnInit, OnDestroy {
  modalState: RoleChangeModalState = {
    isOpen: false,
    currentRole: 'Médico',
    newRole: 'Médico'
  };

  private subscription = new Subscription();

  constructor(
    private roleChangeModalService: RoleChangeModalService,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el estado del modal
    this.subscription.add(
      this.roleChangeModalService.modalState$.subscribe(state => {
        this.modalState = state;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRoleChangeConfirm(event: { newRole: UserRole; reason: string }): void {
    // Cambiar el rol
    this.roleDemoService.changeRole(event.newRole);
    
    // Log para auditoría
    console.log('Cambio de rol global registrado:', {
      from: this.modalState.currentRole,
      to: event.newRole,
      reason: event.reason,
      context: this.modalState.context || 'global',
      timestamp: new Date().toISOString()
    });

    // Cerrar el modal
    this.roleChangeModalService.closeRoleChangeModal();

    // Mostrar notificación de éxito
    console.log(`Rol cambiado exitosamente a: ${event.newRole}`);
  }

  onRoleChangeCancel(): void {
    this.roleChangeModalService.closeRoleChangeModal();
  }
}