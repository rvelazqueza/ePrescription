import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface VisualFeedback {
  id: string;
  type: 'loading' | 'success' | 'error' | 'info';
  message: string;
  duration?: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VisualFeedbackService {
  private feedbackSubject = new BehaviorSubject<VisualFeedback[]>([]);
  private loadingStates = new Map<string, boolean>();
  
  feedback$ = this.feedbackSubject.asObservable();
  
  constructor() {}
  
  // Loading states
  setLoading(key: string, loading: boolean, message?: string): void {
    this.loadingStates.set(key, loading);
    
    if (loading && message) {
      this.showFeedback({
        id: `loading-${key}`,
        type: 'loading',
        message,
        persistent: true
      });
    } else {
      this.removeFeedback(`loading-${key}`);
    }
  }
  
  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }
  
  // Visual feedback
  showFeedback(feedback: Omit<VisualFeedback, 'id'> & { id?: string }): string {
    const id = feedback.id || this.generateId();
    const newFeedback: VisualFeedback = {
      ...feedback,
      id,
      duration: feedback.duration || 3000
    };
    
    const current = this.feedbackSubject.value;
    this.feedbackSubject.next([...current, newFeedback]);
    
    // Auto-remove if not persistent
    if (!newFeedback.persistent && newFeedback.duration) {
      setTimeout(() => {
        this.removeFeedback(id);
      }, newFeedback.duration);
    }
    
    return id;
  }
  
  removeFeedback(id: string): void {
    const current = this.feedbackSubject.value;
    const filtered = current.filter(f => f.id !== id);
    this.feedbackSubject.next(filtered);
  }
  
  clearAllFeedback(): void {
    this.feedbackSubject.next([]);
  }
  
  // Convenience methods
  showSuccess(message: string, duration = 3000): string {
    return this.showFeedback({
      type: 'success',
      message,
      duration
    });
  }
  
  showError(message: string, duration = 5000): string {
    return this.showFeedback({
      type: 'error',
      message,
      duration
    });
  }
  
  showInfo(message: string, duration = 3000): string {
    return this.showFeedback({
      type: 'info',
      message,
      duration
    });
  }
  
  showLoading(message: string, key?: string): string {
    const loadingKey = key || 'default';
    this.setLoading(loadingKey, true, message);
    return `loading-${loadingKey}`;
  }
  
  hideLoading(key = 'default'): void {
    this.setLoading(key, false);
  }
  
  // Progress tracking
  updateProgress(key: string, progress: number, message?: string): void {
    const id = `progress-${key}`;
    const existingIndex = this.feedbackSubject.value.findIndex(f => f.id === id);
    
    const feedback: VisualFeedback = {
      id,
      type: 'info',
      message: message || `Progreso: ${Math.round(progress)}%`,
      persistent: true
    };
    
    const current = this.feedbackSubject.value;
    if (existingIndex >= 0) {
      current[existingIndex] = feedback;
      this.feedbackSubject.next([...current]);
    } else {
      this.feedbackSubject.next([...current, feedback]);
    }
    
    // Remove when complete
    if (progress >= 100) {
      setTimeout(() => {
        this.removeFeedback(id);
      }, 1000);
    }
  }
  
  // Batch operations feedback
  showBatchOperation(
    operation: string,
    total: number,
    onUpdate?: (current: number, total: number) => void
  ): {
    update: (current: number) => void;
    complete: () => void;
    error: (message: string) => void;
  } {
    const key = this.generateId();
    let current = 0;
    
    const updateMessage = () => {
      const progress = (current / total) * 100;
      this.updateProgress(key, progress, `${operation}: ${current}/${total}`);
      onUpdate?.(current, total);
    };
    
    // Initial state
    updateMessage();
    
    return {
      update: (newCurrent: number) => {
        current = newCurrent;
        updateMessage();
      },
      complete: () => {
        current = total;
        updateMessage();
        setTimeout(() => {
          this.showSuccess(`${operation} completado exitosamente`);
        }, 1000);
      },
      error: (message: string) => {
        this.removeFeedback(`progress-${key}`);
        this.showError(`Error en ${operation}: ${message}`);
      }
    };
  }
  
  // Form validation feedback
  showFieldError(fieldName: string, message: string): void {
    const element = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
    if (element) {
      element.classList.add('error-border');
      
      // Remove error styling after a delay
      setTimeout(() => {
        element.classList.remove('error-border');
      }, 5000);
    }
    
    this.showError(`${fieldName}: ${message}`);
  }
  
  showFieldSuccess(fieldName: string, message?: string): void {
    const element = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
    if (element) {
      element.classList.add('success-border');
      
      // Remove success styling after a delay
      setTimeout(() => {
        element.classList.remove('success-border');
      }, 3000);
    }
    
    if (message) {
      this.showSuccess(message);
    }
  }
  
  // Network status feedback
  showNetworkError(): void {
    this.showError('Error de conexión. Verifique su conexión a internet.', 0);
  }
  
  showNetworkReconnected(): void {
    this.showSuccess('Conexión restablecida');
  }
  
  // Search feedback
  showSearchResults(count: number, query: string): void {
    if (count === 0) {
      this.showInfo(`No se encontraron resultados para "${query}"`);
    } else {
      this.showSuccess(`Se encontraron ${count} resultados para "${query}"`);
    }
  }
  
  // Data operation feedback
  showDataSaved(entityName: string): void {
    this.showSuccess(`${entityName} guardado exitosamente`);
  }
  
  showDataDeleted(entityName: string): void {
    this.showSuccess(`${entityName} eliminado exitosamente`);
  }
  
  showDataError(operation: string, entityName: string): void {
    this.showError(`Error al ${operation} ${entityName}. Intente nuevamente.`);
  }
  
  // Animation helpers
  highlightElement(selector: string, duration = 2000): void {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('search-highlight');
      setTimeout(() => {
        element.classList.remove('search-highlight');
      }, duration);
    }
  }
  
  pulseElement(selector: string, duration = 1000): void {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('pulse');
      setTimeout(() => {
        element.classList.remove('pulse');
      }, duration);
    }
  }
  
  bounceElement(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('bounce');
      setTimeout(() => {
        element.classList.remove('bounce');
      }, 1000);
    }
  }
  
  private generateId(): string {
    return `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}