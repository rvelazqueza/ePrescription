import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface DashboardKPI {
  label: string;
  value: number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  route: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  gradient: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  status: 'success' | 'warning' | 'alert' | 'info';
  icon: string;
  route: string;
}

export interface Insight {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  action: string;
  route: string;
}

export interface DashboardStats {
  kpis: DashboardKPI[];
  quickActions: QuickAction[];
  recentActivity: RecentActivity[];
  insights: Insight[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

  /**
   * Get dashboard statistics for the current user role
   */
  getDashboardStats(role: string): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`, {
      params: { role }
    }).pipe(
      tap(stats => console.log(`Dashboard stats loaded for role: ${role}`, stats)),
      catchError(error => {
        console.error('Error loading dashboard stats:', error);
        // Return empty stats instead of mock data
        return of({
          kpis: [],
          quickActions: [],
          recentActivity: [],
          insights: []
        });
      })
    );
  }

  /**
   * Get KPIs for the current user role
   */
  getKPIs(role: string): Observable<DashboardKPI[]> {
    return this.http.get<DashboardKPI[]>(`${this.apiUrl}/kpis`, {
      params: { role }
    }).pipe(
      tap(kpis => console.log(`KPIs loaded for role: ${role}`, kpis)),
      catchError(error => {
        console.error('Error loading KPIs:', error);
        return of([]);
      })
    );
  }

  /**
   * Get recent activity for the current user
   */
  getRecentActivity(role: string, limit: number = 10): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.apiUrl}/recent-activity`, {
      params: { role, limit: limit.toString() }
    }).pipe(
      tap(activity => console.log(`Recent activity loaded for role: ${role}`, activity)),
      catchError(error => {
        console.error('Error loading recent activity:', error);
        return of([]);
      })
    );
  }

  /**
   * Get insights for the current user role
   */
  getInsights(role: string): Observable<Insight[]> {
    return this.http.get<Insight[]>(`${this.apiUrl}/insights`, {
      params: { role }
    }).pipe(
      tap(insights => console.log(`Insights loaded for role: ${role}`, insights)),
      catchError(error => {
        console.error('Error loading insights:', error);
        return of([]);
      })
    );
  }
}
