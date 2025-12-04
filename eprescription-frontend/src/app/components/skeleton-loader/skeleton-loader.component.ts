import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse">
      <!-- Patient Profile Skeleton -->
      <div *ngIf="type === 'patient-profile'" class="space-y-6">
        <!-- Header skeleton -->
        <div class="bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg h-48">
          <div class="p-8">
            <div class="flex items-center gap-6">
              <div class="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div class="space-y-3">
                <div class="h-8 bg-gray-200 rounded w-64"></div>
                <div class="grid grid-cols-4 gap-4">
                  <div class="h-4 bg-gray-200 rounded w-20"></div>
                  <div class="h-4 bg-gray-200 rounded w-16"></div>
                  <div class="h-4 bg-gray-200 rounded w-24"></div>
                  <div class="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div class="flex gap-3">
                  <div class="h-10 bg-gray-200 rounded w-32"></div>
                  <div class="h-10 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Medical alerts skeleton -->
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="h-6 bg-gray-200 rounded w-40 mb-4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Info cards skeleton -->
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div class="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div class="grid gap-4 md:grid-cols-2">
              <div *ngFor="let item of [1,2,3,4,5,6]" class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-24"></div>
                <div class="h-5 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="h-6 bg-gray-200 rounded w-40 mb-4"></div>
            <div class="space-y-4">
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-32"></div>
                <div class="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-36"></div>
                <div class="space-y-1">
                  <div class="h-4 bg-gray-200 rounded w-full"></div>
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prescription List Skeleton -->
      <div *ngIf="type === 'prescription-list'" class="space-y-6">
        <!-- Header skeleton -->
        <div class="bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg h-32 p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div class="space-y-2">
                <div class="h-6 bg-gray-200 rounded w-48"></div>
                <div class="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="h-8 bg-gray-200 rounded w-24"></div>
              <div class="h-8 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
        </div>

        <!-- Stats skeleton -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div *ngFor="let item of [1,2,3,4,5]" class="bg-white rounded-lg shadow p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div class="space-y-1">
                <div class="h-6 bg-gray-200 rounded w-8"></div>
                <div class="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters skeleton -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1 h-10 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded w-48"></div>
            <div class="h-10 bg-gray-200 rounded w-48"></div>
            <div class="h-10 bg-gray-200 rounded w-48"></div>
          </div>
        </div>

        <!-- Prescription cards skeleton -->
        <div class="bg-white rounded-lg shadow divide-y divide-gray-200">
          <div *ngFor="let item of [1,2,3]" class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1 flex items-start gap-4">
                <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div class="flex-1 space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="h-6 bg-gray-200 rounded w-32"></div>
                    <div class="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <div class="h-4 bg-gray-200 rounded w-24"></div>
                      <div class="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div class="space-y-2">
                      <div class="h-4 bg-gray-200 rounded w-20"></div>
                      <div class="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-28"></div>
                    <div class="space-y-1">
                      <div class="h-4 bg-gray-200 rounded w-full"></div>
                      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="w-8 h-8 bg-gray-200 rounded"></div>
                <div class="w-8 h-8 bg-gray-200 rounded"></div>
                <div class="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Simple Card Skeleton -->
      <div *ngIf="type === 'card'" class="bg-white rounded-lg shadow p-6">
        <div class="space-y-4">
          <div class="h-6 bg-gray-200 rounded w-1/3"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      <!-- List Item Skeleton -->
      <div *ngIf="type === 'list-item'" class="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
        <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-5 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div class="w-8 h-8 bg-gray-200 rounded"></div>
      </div>

      <!-- Table Row Skeleton -->
      <div *ngIf="type === 'table-row'" class="grid grid-cols-5 gap-4 p-4 border-b border-gray-200">
        <div class="h-4 bg-gray-200 rounded"></div>
        <div class="h-4 bg-gray-200 rounded"></div>
        <div class="h-4 bg-gray-200 rounded"></div>
        <div class="h-4 bg-gray-200 rounded"></div>
        <div class="h-4 bg-gray-200 rounded"></div>
      </div>

      <!-- Stats Card Skeleton -->
      <div *ngIf="type === 'stats-card'" class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div class="space-y-1">
            <div class="h-6 bg-gray-200 rounded w-12"></div>
            <div class="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: 'patient-profile' | 'prescription-list' | 'card' | 'list-item' | 'table-row' | 'stats-card' = 'card';
}