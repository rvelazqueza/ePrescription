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

export interface SystemMetric {
  label: string;
  status: string;
  health: number;
  icon: string;
  color: string;
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

  /**
   * Get system health metrics
   * Returns Observable<SystemMetric[]> with real-time system status
   */
  getSystemMetrics(): Observable<SystemMetric[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/health`).pipe(
      map(healthData => this.mapHealthDataToMetrics(healthData)),
      catchError(error => {
        console.error('Error loading system metrics:', error);
        // Return fallback metrics on error
        return of(this.getFallbackMetrics());
      }),
      tap(metrics => console.log('System metrics loaded:', metrics))
    );
  }

  /**
   * Map health check response to SystemMetric array
   */
  private mapHealthDataToMetrics(healthData: any): SystemMetric[] {
    const metrics: SystemMetric[] = [];

    // Database health
    if (healthData.checks?.database) {
      const db = healthData.checks.database;
      metrics.push({
        label: 'Base de datos',
        status: db.status === 'healthy' ? 'Operativa' : 'Error',
        health: db.status === 'healthy' ? 100 : 0,
        icon: 'database',
        color: db.status === 'healthy' ? 'green' : 'red'
      });
    }

    // API health
    if (healthData.checks?.api) {
      const api = healthData.checks.api;
      metrics.push({
        label: 'API Sistema',
        status: api.status === 'healthy' ? 'En línea' : 'Error',
        health: api.status === 'healthy' ? 100 : 0,
        icon: 'zap',
        color: api.status === 'healthy' ? 'green' : 'red'
      });
    }

    // Memory health
    if (healthData.checks?.memory) {
      const memory = healthData.checks.memory;
      metrics.push({
        label: 'Memoria Sistema',
        status: memory.status === 'healthy' ? 'Normal' : memory.status === 'warning' ? 'Advertencia' : 'Crítico',
        health: memory.healthPercentage || 0,
        icon: 'shield-check',
        color: memory.status === 'healthy' ? 'green' : memory.status === 'warning' ? 'yellow' : 'red'
      });
    }

    // Response time
    if (healthData.checks?.responseTime) {
      const rt = healthData.checks.responseTime;
      const responseTimeMs = rt.responseTimeMs || 0;
      metrics.push({
        label: 'Tiempo de respuesta',
        status: `${responseTimeMs}ms`,
        health: responseTimeMs < 100 ? 100 : responseTimeMs < 500 ? 80 : 50,
        icon: 'trending-up',
        color: responseTimeMs < 100 ? 'green' : responseTimeMs < 500 ? 'yellow' : 'red'
      });
    }

    return metrics;
  }

  /**
   * Fallback metrics when health check fails
   */
  private getFallbackMetrics(): SystemMetric[] {
    return [
      {
        label: 'Base de datos',
        status: 'Desconocido',
        health: 0,
        icon: 'database',
        color: 'gray'
      },
      {
        label: 'API Sistema',
        status: 'Sin conexión',
        health: 0,
        icon: 'zap',
        color: 'red'
      },
      {
        label: 'Memoria Sistema',
        status: 'Desconocido',
        health: 0,
        icon: 'shield-check',
        color: 'gray'
      },
      {
        label: 'Tiempo de respuesta',
        status: 'N/A',
        health: 0,
        icon: 'trending-up',
        color: 'gray'
      }
    ];
  }
}
