import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface OptimizedImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  lazy?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {

  /**
   * Generate optimized image URL with specified parameters
   * Requirements: 4.6, 5.5
   */
  getOptimizedImageUrl(originalUrl: string, options: OptimizedImageOptions = {}): string {
    if (!originalUrl) {
      return this.getDefaultAvatarUrl();
    }

    const {
      width = 200,
      height = 200,
      quality = 80,
      format = 'webp'
    } = options;

    // In a real implementation, this would integrate with an image optimization service
    // For now, we'll return the original URL with query parameters for future integration
    const url = new URL(originalUrl, window.location.origin);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('f', format);

    return url.toString();
  }

  /**
   * Get default avatar URL for patients without profile pictures
   * Requirements: 4.6, 5.5
   */
  getDefaultAvatarUrl(): string {
    // Return a data URL for a simple SVG avatar to avoid external requests
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#avatarGradient)"/>
        <circle cx="100" cy="80" r="30" fill="white" opacity="0.9"/>
        <path d="M 60 140 Q 100 120 140 140 L 140 200 L 60 200 Z" fill="white" opacity="0.9"/>
      </svg>
    `)}`;
  }

  /**
   * Preload critical images for better performance
   * Requirements: 4.6, 5.5
   */
  preloadImage(url: string): Observable<boolean> {
    return new Observable(observer => {
      const img = new Image();
      
      img.onload = () => {
        observer.next(true);
        observer.complete();
      };
      
      img.onerror = () => {
        observer.next(false);
        observer.complete();
      };
      
      img.src = url;
    });
  }

  /**
   * Create responsive image srcset for different screen densities
   * Requirements: 4.6, 5.5
   */
  generateSrcSet(baseUrl: string, sizes: number[] = [1, 2, 3]): string {
    if (!baseUrl) {
      return '';
    }

    return sizes
      .map(density => {
        const optimizedUrl = this.getOptimizedImageUrl(baseUrl, {
          width: 200 * density,
          height: 200 * density,
          quality: density === 1 ? 80 : 70 // Lower quality for higher density
        });
        return `${optimizedUrl} ${density}x`;
      })
      .join(', ');
  }

  /**
   * Check if WebP format is supported by the browser
   * Requirements: 4.6, 5.5
   */
  isWebPSupported(): Promise<boolean> {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Get optimized format based on browser support
   * Requirements: 4.6, 5.5
   */
  async getOptimalFormat(): Promise<'webp' | 'jpeg'> {
    const supportsWebP = await this.isWebPSupported();
    return supportsWebP ? 'webp' : 'jpeg';
  }

  /**
   * Calculate image dimensions maintaining aspect ratio
   * Requirements: 4.6, 5.5
   */
  calculateDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth: number, 
    maxHeight: number
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;
    
    let width = maxWidth;
    let height = maxHeight;
    
    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /**
   * Generate blur placeholder for lazy loading
   * Requirements: 4.6, 5.5
   */
  generateBlurPlaceholder(width: number = 200, height: number = 200): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return this.getDefaultAvatarUrl();
    }
    
    // Create a simple gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', 0.1); // Very low quality for small size
  }
}