import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, fromEvent, takeUntil, debounceTime } from 'rxjs';

export interface VirtualScrollItem {
  id: string;
  [key: string]: any;
}

@Component({
  selector: 'app-virtual-scroll-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="virtual-scroll-container" #scrollContainer>
      <div class="virtual-scroll-content" [style.height.px]="totalHeight">
        <div 
          class="virtual-scroll-viewport" 
          [style.transform]="'translateY(' + offsetY + 'px)'">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .virtual-scroll-container {
      height: 100%;
      overflow-y: auto;
      position: relative;
    }
    
    .virtual-scroll-content {
      position: relative;
    }
    
    .virtual-scroll-viewport {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualScrollTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() items: VirtualScrollItem[] = [];
  @Input() itemHeight = 60; // Height of each row in pixels
  @Input() containerHeight = 400; // Height of the scroll container
  @Input() bufferSize = 5; // Number of items to render outside visible area
  
  @Output() visibleItemsChange = new EventEmitter<VirtualScrollItem[]>();
  @Output() scrollPositionChange = new EventEmitter<number>();
  
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef<HTMLDivElement>;
  
  private destroy$ = new Subject<void>();
  
  visibleItems: VirtualScrollItem[] = [];
  startIndex = 0;
  endIndex = 0;
  offsetY = 0;
  totalHeight = 0;
  
  ngOnInit(): void {
    this.calculateVisibleItems();
  }
  
  ngAfterViewInit(): void {
    // Listen to scroll events with debouncing for performance
    fromEvent(this.scrollContainer.nativeElement, 'scroll').pipe(
      debounceTime(16), // ~60fps
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onScroll();
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private onScroll(): void {
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this.calculateVisibleItems(scrollTop);
    this.scrollPositionChange.emit(scrollTop);
  }
  
  private calculateVisibleItems(scrollTop = 0): void {
    if (!this.items.length) {
      this.visibleItems = [];
      this.totalHeight = 0;
      return;
    }
    
    this.totalHeight = this.items.length * this.itemHeight;
    
    const visibleItemCount = Math.ceil(this.containerHeight / this.itemHeight);
    
    this.startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.bufferSize);
    this.endIndex = Math.min(
      this.items.length - 1,
      this.startIndex + visibleItemCount + (this.bufferSize * 2)
    );
    
    this.offsetY = this.startIndex * this.itemHeight;
    this.visibleItems = this.items.slice(this.startIndex, this.endIndex + 1);
    
    this.visibleItemsChange.emit(this.visibleItems);
  }
  
  scrollToIndex(index: number): void {
    const scrollTop = index * this.itemHeight;
    this.scrollContainer.nativeElement.scrollTop = scrollTop;
  }
  
  scrollToTop(): void {
    this.scrollContainer.nativeElement.scrollTop = 0;
  }
}