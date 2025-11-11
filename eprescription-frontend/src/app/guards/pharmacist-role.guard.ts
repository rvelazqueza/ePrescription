import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RoleDemoService, UserRole } from '../services/role-demo.service';

@Injectable({
  providedIn: 'root'
})
export class PharmacistRoleGuard implements CanActivate {
  
  constructor(
    private roleDemoService: RoleDemoService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.roleDemoService.currentSession$.pipe(
      take(1),
      map(session => {
        const currentRole = session.activeRole;
        
        // Si el usuario ya es farmacéutico, permitir acceso
        if (currentRole === 'Farmacéutico') {
          return true;
        }
        
        // Si no es farmacéutico, permitir acceso pero marcar que se debe mostrar el modal
        // El componente se encargará de mostrar el modal basándose en el rol
        return true;
      })
    );
  }

  /**
   * Verifica si el usuario actual tiene rol de farmacéutico
   */
  isPharmacist(): Observable<boolean> {
    return this.roleDemoService.currentSession$.pipe(
      map(session => session.activeRole === 'Farmacéutico')
    );
  }

  /**
   * Verifica si se debe mostrar el modal de sugerencia
   */
  shouldShowRoleSuggestion(): Observable<boolean> {
    return this.roleDemoService.currentSession$.pipe(
      map(session => session.activeRole !== 'Farmacéutico')
    );
  }
}