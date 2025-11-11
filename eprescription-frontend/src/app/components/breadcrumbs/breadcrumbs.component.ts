import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronRight, Home } from 'lucide-angular';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  icon?: any;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <nav class="fixed left-64 right-0 z-30 bg-gray-50 border-b border-gray-200 px-6 py-3" style="top: 93px;" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <!-- Home breadcrumb -->
        <li class="inline-flex items-center">
          <a routerLink="/dashboard" 
             class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            <lucide-icon [img]="homeIcon" class="w-4 h-4 mr-2" aria-hidden="true"></lucide-icon>
            Inicio
          </a>
        </li>

        <!-- Dynamic breadcrumbs -->
        <li *ngFor="let item of items; let last = last" class="inline-flex items-center">
          <lucide-icon [img]="chevronRightIcon" class="w-4 h-4 text-gray-400 mx-1" aria-hidden="true"></lucide-icon>
          
          <a *ngIf="item.route && !last" 
             [routerLink]="item.route"
             class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            <lucide-icon *ngIf="item.icon" [img]="item.icon" class="w-4 h-4 mr-2" aria-hidden="true"></lucide-icon>
            {{ item.label }}
          </a>
          
          <span *ngIf="!item.route || last" 
                class="inline-flex items-center text-sm font-medium text-gray-500"
                [attr.aria-current]="last ? 'page' : null">
            <lucide-icon *ngIf="item.icon" [img]="item.icon" class="w-4 h-4 mr-2" aria-hidden="true"></lucide-icon>
            {{ item.label }}
          </span>
        </li>
      </ol>
    </nav>
  `
})
export class BreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];

  homeIcon = Home;
  chevronRightIcon = ChevronRight;
}