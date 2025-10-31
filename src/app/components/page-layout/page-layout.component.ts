import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent, BreadcrumbItem } from '../breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, PageHeaderComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Header -->
      <app-page-header 
        [title]="title" 
        [description]="description" 
        [icon]="icon"
        [actionButton]="hasActionButton"
        [gradient]="headerGradient"
        [showMedicalIcons]="showMedicalIcons"
        [showCreateUserButton]="showCreateUserButton"
        [createUserButtonClick]="createUserButtonClick"
        [showSecurityBadge]="showSecurityBadge">
        <ng-content select="[slot=action]"></ng-content>
      </app-page-header>
      
      <!-- Content -->
      <ng-content></ng-content>
    </div>
  `
})
export class PageLayoutComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: any;
  @Input() breadcrumbItems: BreadcrumbItem[] = [];
  @Input() hasActionButton: boolean = false;
  @Input() headerGradient: string = '';
  @Input() showMedicalIcons: boolean = false;
  @Input() showCreateUserButton: boolean = false;
  @Input() createUserButtonClick: (() => void) | null = null;
  @Input() showSecurityBadge: boolean = false;
}