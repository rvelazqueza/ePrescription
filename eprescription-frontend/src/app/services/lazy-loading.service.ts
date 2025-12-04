import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent, map, filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadingService {
  private intersectionObserver?: IntersectionObserver;
  private loadedImages = new Set<string>();
  
  constructor() {
    this.initIntersectionObserver();
  }
  
  private initIntersectionObserver(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              const callback = element.dataset['lazyCallback'];
              if (callback && (window as any)[callback]) {
                (window as any)[callback](element);
              }
              this.intersectionObserver?.unobserve(element);
            }
          });
        },
        {
          rootMargin: '50px 0px', // Start loading 50px before element comes into view
          threshold: 0.1
        }
      );
    }
  }
  
  observeElement(element: HTMLElement, callback?: () => void): void {
    if (this.intersectionObserver) {
      if (callback) {
        const callbackName = `lazyCallback_${Date.now()}_${Math.random()}`;
        (window as any)[callbackName] = callback;
        element.dataset['lazyCallback'] = callbackName;
      }
      this.intersectionObserver.observe(element);
    }
  }
  
  unobserveElement(element: HTMLElement): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
      const callbackName = element.dataset['lazyCallback'];
      if (callbackName && (window as any)[callbackName]) {
        delete (window as any)[callbackName];
        delete element.dataset['lazyCallback'];
      }
    }
  }
  
  lazyLoadImage(src: string): Observable<string> {
    if (this.loadedImages.has(src)) {
      return new BehaviorSubject(src).asObservable();
    }
    
    return new Observable(observer => {
      const img = new Image();
      
      const onLoad = () => {
        this.loadedImages.add(src);
        observer.next(src);
        observer.complete();
        cleanup();
      };
      
      const onError = () => {
        observer.error(new Error(`Failed to load image: ${src}`));
        cleanup();
      };
      
      const cleanup = () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
      };
      
      img.addEventListener('load', onLoad);
      img.addEventListener('error', onError);
      img.src = src;
      
      return cleanup;
    });
  }
  
  preloadImages(urls: string[]): Observable<string[]> {
    const loadPromises = urls.map(url => 
      this.lazyLoadImage(url).pipe(take(1)).toPromise()
    );
    
    return new Observable(observer => {
      Promise.allSettled(loadPromises).then(results => {
        const loaded = results
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<string>).value);
        
        observer.next(loaded);
        observer.complete();
      });
    });
  }
  
  isImageLoaded(src: string): boolean {
    return this.loadedImages.has(src);
  }
  
  clearImageCache(): void {
    this.loadedImages.clear();
  }
  
  destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.clearImageCache();
  }
}