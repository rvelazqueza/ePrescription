import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  cacheHitRate: number;
  imageOptimization: number;
}

export interface PerformanceReport {
  timestamp: Date;
  component: string;
  metrics: PerformanceMetrics;
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private performanceData$ = new BehaviorSubject<PerformanceReport[]>([]);
  private startTimes = new Map<string, number>();
  private networkRequestCount = 0;
  private cacheHits = 0;
  private cacheMisses = 0;

  constructor() {
    this.initializePerformanceObserver();
  }

  /**
   * Initialize Performance Observer for monitoring
   * Requirements: 4.6, 5.5
   */
  private initializePerformanceObserver(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor navigation timing
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
          }
        });
      });

      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'resource') {
            this.recordResourceMetrics(entry as PerformanceResourceTiming);
          }
        });
      });

      // Monitor largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });

      try {
        navObserver.observe({ entryTypes: ['navigation'] });
        resourceObserver.observe({ entryTypes: ['resource'] });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }
  }

  /**
   * Start performance measurement for a component
   * Requirements: 4.6, 5.5
   */
  startMeasurement(componentName: string): void {
    this.startTimes.set(componentName, performance.now());
  }

  /**
   * End performance measurement and generate report
   * Requirements: 4.6, 5.5
   */
  endMeasurement(componentName: string): PerformanceReport | null {
    const startTime = this.startTimes.get(componentName);
    if (!startTime) {
      console.warn(`No start time found for component: ${componentName}`);
      return null;
    }

    const endTime = performance.now();
    const loadTime = endTime - startTime;

    const metrics: PerformanceMetrics = {
      loadTime,
      renderTime: this.getRenderTime(),
      memoryUsage: this.getMemoryUsage(),
      networkRequests: this.networkRequestCount,
      cacheHitRate: this.getCacheHitRate(),
      imageOptimization: this.getImageOptimizationScore()
    };

    const report: PerformanceReport = {
      timestamp: new Date(),
      component: componentName,
      metrics,
      recommendations: this.generateRecommendations(metrics)
    };

    // Add to performance data
    const currentData = this.performanceData$.value;
    this.performanceData$.next([...currentData, report]);

    // Clean up
    this.startTimes.delete(componentName);

    return report;
  }

  /**
   * Record navigation metrics
   * Requirements: 4.6, 5.5
   */
  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const metrics = {
      dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,
      tcpConnection: entry.connectEnd - entry.connectStart,
      serverResponse: entry.responseEnd - entry.requestStart,
      domProcessing: entry.domContentLoadedEventEnd - entry.responseEnd,
      totalLoad: entry.loadEventEnd - entry.fetchStart
    };

    console.log('Navigation Metrics:', metrics);
  }

  /**
   * Record resource loading metrics
   * Requirements: 4.6, 5.5
   */
  private recordResourceMetrics(entry: PerformanceResourceTiming): void {
    this.networkRequestCount++;

    // Check if resource was served from cache
    if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
      this.cacheHits++;
    } else {
      this.cacheMisses++;
    }

    // Log slow resources
    if (entry.duration > 1000) {
      console.warn(`Slow resource detected: ${entry.name} took ${entry.duration}ms`);
    }
  }

  /**
   * Get render time using paint timing
   * Requirements: 4.6, 5.5
   */
  private getRenderTime(): number {
    if (typeof window !== 'undefined') {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      return fcp ? fcp.startTime : 0;
    }
    return 0;
  }

  /**
   * Get memory usage information
   * Requirements: 4.6, 5.5
   */
  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    return 0;
  }

  /**
   * Calculate cache hit rate
   * Requirements: 4.6, 5.5
   */
  private getCacheHitRate(): number {
    const total = this.cacheHits + this.cacheMisses;
    return total > 0 ? this.cacheHits / total : 0;
  }

  /**
   * Get image optimization score
   * Requirements: 4.6, 5.5
   */
  private getImageOptimizationScore(): number {
    if (typeof window !== 'undefined') {
      const images = document.querySelectorAll('img');
      let optimizedCount = 0;
      
      images.forEach(img => {
        // Check for modern formats, lazy loading, proper sizing
        const hasModernFormat = img.src.includes('webp') || img.src.includes('avif');
        const hasLazyLoading = img.loading === 'lazy';
        const hasProperSizing = img.width && img.height;
        
        if (hasModernFormat && hasLazyLoading && hasProperSizing) {
          optimizedCount++;
        }
      });
      
      return images.length > 0 ? optimizedCount / images.length : 1;
    }
    return 1;
  }

  /**
   * Generate performance recommendations
   * Requirements: 4.6, 5.5
   */
  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.loadTime > 3000) {
      recommendations.push('Consider implementing code splitting to reduce initial bundle size');
    }

    if (metrics.renderTime > 2500) {
      recommendations.push('Optimize critical rendering path and reduce render-blocking resources');
    }

    if (metrics.memoryUsage > 0.8) {
      recommendations.push('High memory usage detected. Consider implementing memory optimization techniques');
    }

    if (metrics.cacheHitRate < 0.7) {
      recommendations.push('Low cache hit rate. Implement better caching strategies');
    }

    if (metrics.imageOptimization < 0.8) {
      recommendations.push('Improve image optimization: use modern formats, lazy loading, and proper sizing');
    }

    if (metrics.networkRequests > 50) {
      recommendations.push('High number of network requests. Consider bundling resources or using HTTP/2 push');
    }

    return recommendations;
  }

  /**
   * Get performance data observable
   * Requirements: 4.6, 5.5
   */
  getPerformanceData(): Observable<PerformanceReport[]> {
    return this.performanceData$.asObservable();
  }

  /**
   * Get latest performance report for a component
   * Requirements: 4.6, 5.5
   */
  getLatestReport(componentName: string): PerformanceReport | null {
    const reports = this.performanceData$.value;
    const componentReports = reports.filter(report => report.component === componentName);
    return componentReports.length > 0 ? componentReports[componentReports.length - 1] : null;
  }

  /**
   * Clear performance data
   * Requirements: 4.6, 5.5
   */
  clearData(): void {
    this.performanceData$.next([]);
    this.networkRequestCount = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  /**
   * Export performance data as JSON
   * Requirements: 4.6, 5.5
   */
  exportData(): string {
    return JSON.stringify(this.performanceData$.value, null, 2);
  }

  /**
   * Measure Core Web Vitals
   * Requirements: 4.6, 5.5
   */
  measureCoreWebVitals(): Promise<{lcp: number, fid: number, cls: number}> {
    return new Promise((resolve) => {
      const vitals = { lcp: 0, fid: 0, cls: 0 };
      let metricsCollected = 0;
      const totalMetrics = 3;

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
          metricsCollected++;
          if (metricsCollected === totalMetrics) resolve(vitals);
        });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            const fidEntry = entry as any; // Type assertion for FID specific properties
            vitals.fid = fidEntry.processingStart - entry.startTime;
            metricsCollected++;
            if (metricsCollected === totalMetrics) resolve(vitals);
          });
        });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });
          vitals.cls = clsValue;
          metricsCollected++;
          if (metricsCollected === totalMetrics) resolve(vitals);
        });

        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          fidObserver.observe({ entryTypes: ['first-input'] });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Core Web Vitals measurement not fully supported:', error);
          resolve(vitals);
        }

        // Fallback timeout
        setTimeout(() => resolve(vitals), 5000);
      } else {
        resolve(vitals);
      }
    });
  }
}