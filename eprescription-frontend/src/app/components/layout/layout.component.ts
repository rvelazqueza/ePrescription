import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { RoleSuggestionModalComponent } from '../role-suggestion-modal/role-suggestion-modal.component';
import { GlobalRoleChangeModalComponent } from '../global-role-change-modal/global-role-change-modal.component';
import { NotificationContainerComponent } from '../ui/notification-container/notification-container.component';
import { AuthService } from '../../services/auth.service';
import { RoleSuggestionService } from '../../services/role-suggestion.service';
import { RoleDemoService, UserRole } from '../../services/role-demo.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopBarComponent, RoleSuggestionModalComponent, GlobalRoleChangeModalComponent, NotificationContainerComponent],
  template: `
    <!-- Layout with sidebar and topbar (for authenticated pages) -->
    <div *ngIf="shouldShowLayout" class="flex h-screen bg-gray-50">
      <app-sidebar></app-sidebar>
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-top-bar></app-top-bar>
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 pb-6" style="padding-top: 75px;">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <!-- Full screen layout (for login page or unauthenticated) -->
    <div *ngIf="!shouldShowLayout" class="h-screen">
      <router-outlet></router-outlet>
    </div>

    <!-- Global Role Suggestion Modal -->
    <app-role-suggestion-modal
      [isOpen]="showRoleSuggestionModal"
      [suggestedRole]="suggestedRole"
      [pageName]="currentPageName"
      (dismiss)="onDismissRoleSuggestion()"
      (roleChanged)="onRoleChanged()"
    ></app-role-suggestion-modal>

    <!-- Global Role Change Confirmation Modal -->
    <app-global-role-change-modal></app-global-role-change-modal>

    <!-- Global Notification Container -->
    <app-notification-container></app-notification-container>
  `
})
export class LayoutComponent implements OnInit, OnDestroy {
  isLoginPage = false;
  isAuthenticated = false;
  currentUrl = '';
  showRoleSuggestionModal = false;
  suggestedRole: UserRole = 'Médico Jefe';
  currentPageName = '';
  
  private routerSubscription?: Subscription;
  private authSubscription?: Subscription;
  private roleSuggestionSubscription?: Subscription;
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private roleSuggestionService: RoleSuggestionService,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit() {
    // Check initial authentication state
    this.isAuthenticated = this.authService.isAuthenticated();
    
    // Check initial route
    this.checkRoute(this.router.url);
    
    // Verificación inicial después de que todo esté configurado
    setTimeout(() => {
      this.checkAndShowRoleSuggestion();
    }, 1500);

    // Subscribe to authentication changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = user !== null;
      this.updateLayoutVisibility();
    });

    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.checkRoute(event.url);
          setTimeout(() => {
            this.checkAndShowRoleSuggestion();
          }, 800);
        }
      });

    // Subscribe to role changes
    this.subscription.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        setTimeout(() => {
          this.checkAndShowRoleSuggestion();
        }, 300);
      })
    );

    // No necesitamos suscripción al servicio ya que manejamos el modal directamente
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.roleSuggestionSubscription) {
      this.roleSuggestionSubscription.unsubscribe();
    }
    this.subscription.unsubscribe();
  }

  private checkRoute(url: string) {
    this.currentUrl = url;
    // Only consider it login page if explicitly on /login
    this.isLoginPage = url === '/login' || url.startsWith('/login');
    this.updateLayoutVisibility();
  }

  private isImprimirPage(): boolean {
    return this.currentUrl.includes('/prescripciones/imprimir/');
  }

  private updateLayoutVisibility() {
    // Show layout only if user is authenticated AND not on login page
    // This prevents the sidebar from showing during initial load or when not authenticated
  }

  get shouldShowLayout(): boolean {
    return this.isAuthenticated && !this.isLoginPage && !this.isImprimirPage();
  }

  private determineSuggestedRole() {
    // Determinar el rol sugerido basado en la página actual
    if (this.currentUrl.includes('/reportes/actividad-medico')) {
      this.suggestedRole = 'Médico Jefe';
      this.currentPageName = 'actividad-medico';
    } else if (this.currentUrl.includes('/reportes/actividad-farmacia')) {
      this.suggestedRole = 'Médico Jefe';
      this.currentPageName = 'actividad-farmacia';
    } else if (this.currentUrl.includes('/reportes/exportar')) {
      this.suggestedRole = 'Médico Jefe';
      this.currentPageName = 'exportar-reportes';
    } else if (this.currentUrl.includes('/inventario/farmacias')) {
      this.suggestedRole = 'Farmacéutico';
      this.currentPageName = 'farmacias-inventario';
    } else {
      this.suggestedRole = 'Administrador';
      this.currentPageName = 'general';
    }
  }

  onDismissRoleSuggestion() {
    this.showRoleSuggestionModal = false;
  }

  onRoleChanged() {
    // El rol ya fue cambiado en el modal, solo necesitamos limpiar las páginas descartadas
    this.roleSuggestionService.clearDismissedPages();
  }

  private checkAndShowRoleSuggestion() {
    const currentSession = this.roleDemoService.getCurrentSession();
    let shouldShow = false;
    
    // Validar rol según la página actual
    if (this.currentUrl.includes('/reportes/actividad-medico')) {
      this.suggestedRole = 'Médico Jefe';
      this.currentPageName = 'actividad-medico';
      shouldShow = currentSession.activeRole !== 'Médico Jefe' && 
                   currentSession.activeRole !== 'Administrador';
    } else if (this.currentUrl.includes('/reportes/actividad-farmacia')) {
      this.suggestedRole = 'Médico Jefe';
      this.currentPageName = 'actividad-farmacia';
      shouldShow = currentSession.activeRole !== 'Médico Jefe' && 
                   currentSession.activeRole !== 'Administrador';
    } else if (this.currentUrl.includes('/reportes/exportar')) {
      this.suggestedRole = 'Médico Jefe';
      this.currentPageName = 'exportar-reportes';
      shouldShow = currentSession.activeRole !== 'Médico Jefe' && 
                   currentSession.activeRole !== 'Administrador';
    }
    
    if (shouldShow) {
      this.determineSuggestedRole();
      this.showRoleSuggestionModal = true;
    } else {
      this.showRoleSuggestionModal = false;
    }
  }
}