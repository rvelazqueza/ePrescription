import { 
  Component, 
  Input, 
  OnInit, 
  OnDestroy, 
  ElementRef, 
  ViewChild, 
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ImageOptimizationService, OptimizedImageOptions } from '../../services/image-optimization.service';
import { LazyLoadingService } from '../../services/lazy-loading.service';

@Component({
  selector: 'app-lazy-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lazy-image-container" 
         [style.width.px]="width" 
         [style.height.px]="height"
         [attr.aria-label]="alt">
      
      <!-- Placeholder while loading -->
      <div *ngIf="!imageLoaded" 
           class="lazy-image-placeholder"
           [style.background-image]="'url(' + placeholderUrl + ')'"
           [attr.aria-hidden]="true">
        <div class="lazy-image-spinner" *ngIf="isLoading">
          <div class="spinner"></div>
        </div>
      </div>
      
      <!-- Actual image -->
      <img #imageElement
           *ngIf="shouldLoadImage"
           [src]="optimizedSrc"
           [srcset]="srcSet"
           [alt]="alt"
           [width]="width"
           [height]="height"
           class="lazy-image"
           [class.loaded]="imageLoaded"
           (load)="onImageLoad()"
           (error)="onImageError()"
           loading="lazy"
           decoding="async">
    </div>
  `,
  styles: [`
    .lazy-image-container {
      position: relative;
      overflow: hidden;
      border-radius: inherit;
      background-color: #f3f4f6;
    }

    .lazy-image-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: blur(5px);
      transform: scale(1.1);
      transition: opacity 0.3s ease;
    }

    .lazy-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .lazy-image.loaded {
      opacity: 1;
    }

    .lazy-image-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid #e5e7eb;
      border-top: 2px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
      .lazy-image,
      .lazy-image-placeholder,
      .spinner {
        animation: none;
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyImageComponent implements OnInit, OnDestroy {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() width: number = 200;
  @Input() height: number = 200;
  @Input() quality: number = 80;
  @Input() lazy: boolean = true;
  @Input() placeholder: string = '';

  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;

  optimizedSrc: string = '';
  srcSet: string = '';
  placeholderUrl: string = '';
  imageLoaded: boolean = false;
  shouldLoadImage: boolean = false;
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private imageOptimizationService: ImageOptimizationService,
    private lazyLoadingService: LazyLoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupImage();
    
    if (this.lazy) {
      this.setupLazyLoading();
    } else {
      this.loadImage();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.lazyLoadingService.unobserveElement(this.elementRef.nativeElement);
  }

  private setupImage(): void {
    const options: OptimizedImageOptions = {
      width: this.width,
      height: this.height,
      quality: this.quality,
      format: 'webp'
    };

    // Generate optimized URLs
    this.optimizedSrc = this.imageOptimizationService.getOptimizedImageUrl(this.src, options);
    this.srcSet = this.imageOptimizationService.generateSrcSet(this.src);
    
    // Generate placeholder
    this.placeholderUrl = this.placeholder || 
      this.imageOptimizationService.generateBlurPlaceholder(this.width, this.height);
  }

  private setupLazyLoading(): void {
    // Check if image is already loaded in cache
    if (this.lazyLoadingService.isImageLoaded(this.optimizedSrc)) {
      this.shouldLoadImage = true;
      this.imageLoaded = true;
      this.cdr.markForCheck();
      return;
    }
    
    // Set up intersection observer for lazy loading
    this.lazyLoadingService.observeElement(
      this.elementRef.nativeElement,
      () => this.loadImage()
    );
  }

  private loadImage(): void {
    if (this.shouldLoadImage) return;
    
    this.shouldLoadImage = true;
    this.isLoading = true;
    this.cdr.markForCheck();

    // Use the lazy loading service for optimized image loading
    this.lazyLoadingService.lazyLoadImage(this.optimizedSrc).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.imageLoaded = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.handleImageError();
      }
    });
  }

  onImageLoad(): void {
    this.imageLoaded = true;
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  onImageError(): void {
    this.handleImageError();
  }

  private handleImageError(): void {
    // Fallback to default avatar
    this.optimizedSrc = this.imageOptimizationService.getDefaultAvatarUrl();
    this.imageLoaded = true;
    this.isLoading = false;
    this.cdr.markForCheck();
  }
}