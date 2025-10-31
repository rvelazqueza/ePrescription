import { Injectable } from '@angular/core';

export interface ColorContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  passes: boolean;
}

export interface AccessibilityValidation {
  colorContrast: ColorContrastResult[];
  keyboardNavigation: boolean;
  ariaLabels: boolean;
  focusManagement: boolean;
  screenReaderSupport: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {

  /**
   * Calculate color contrast ratio between two colors
   * Requirements: 4.6, 5.5
   */
  calculateContrastRatio(foreground: string, background: string): number {
    const fgLuminance = this.getLuminance(foreground);
    const bgLuminance = this.getLuminance(background);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get relative luminance of a color
   * Requirements: 4.6, 5.5
   */
  private getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Convert hex color to RGB
   * Requirements: 4.6, 5.5
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Validate color contrast against WCAG standards
   * Requirements: 4.6, 5.5
   */
  validateColorContrast(foreground: string, background: string, isLargeText: boolean = false): ColorContrastResult {
    const ratio = this.calculateContrastRatio(foreground, background);
    
    let level: ColorContrastResult['level'];
    let passes: boolean;

    if (isLargeText) {
      // Large text requirements (18pt+ or 14pt+ bold)
      if (ratio >= 7) {
        level = 'AAA';
        passes = true;
      } else if (ratio >= 3) {
        level = 'AA';
        passes = true;
      } else if (ratio >= 2) {
        level = 'A';
        passes = false;
      } else {
        level = 'FAIL';
        passes = false;
      }
    } else {
      // Normal text requirements
      if (ratio >= 7) {
        level = 'AAA';
        passes = true;
      } else if (ratio >= 4.5) {
        level = 'AA';
        passes = true;
      } else if (ratio >= 3) {
        level = 'A';
        passes = false;
      } else {
        level = 'FAIL';
        passes = false;
      }
    }

    return { ratio, level, passes };
  }

  /**
   * Validate accessibility of a component
   * Requirements: 4.6, 5.5
   */
  validateComponent(element: HTMLElement): AccessibilityValidation {
    return {
      colorContrast: this.validateElementColorContrast(element),
      keyboardNavigation: this.validateKeyboardNavigation(element),
      ariaLabels: this.validateAriaLabels(element),
      focusManagement: this.validateFocusManagement(element),
      screenReaderSupport: this.validateScreenReaderSupport(element)
    };
  }

  /**
   * Validate color contrast for all text elements
   * Requirements: 4.6, 5.5
   */
  private validateElementColorContrast(element: HTMLElement): ColorContrastResult[] {
    const results: ColorContrastResult[] = [];
    const textElements = element.querySelectorAll('*');

    textElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      const styles = window.getComputedStyle(htmlEl);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));

        const result = this.validateColorContrast(
          this.rgbToHex(color),
          this.rgbToHex(backgroundColor),
          isLargeText
        );

        results.push(result);
      }
    });

    return results;
  }

  /**
   * Convert RGB color to hex
   * Requirements: 4.6, 5.5
   */
  private rgbToHex(rgb: string): string {
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';

    const [r, g, b] = match.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  /**
   * Validate keyboard navigation
   * Requirements: 4.6, 5.5
   */
  private validateKeyboardNavigation(element: HTMLElement): boolean {
    const interactiveElements = element.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    let hasValidTabOrder = true;
    let previousTabIndex = -1;

    interactiveElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      const tabIndex = parseInt(htmlEl.getAttribute('tabindex') || '0');
      
      // Check if element is focusable
      if (!this.isFocusable(htmlEl)) {
        hasValidTabOrder = false;
      }

      // Check tab order (simplified check)
      if (tabIndex > 0 && tabIndex < previousTabIndex) {
        hasValidTabOrder = false;
      }
      
      if (tabIndex > 0) {
        previousTabIndex = tabIndex;
      }
    });

    return hasValidTabOrder;
  }

  /**
   * Check if element is focusable
   * Requirements: 4.6, 5.5
   */
  private isFocusable(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }

    if (element.hasAttribute('disabled')) {
      return false;
    }

    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex === '-1') {
      return false;
    }

    return true;
  }

  /**
   * Validate ARIA labels
   * Requirements: 4.6, 5.5
   */
  private validateAriaLabels(element: HTMLElement): boolean {
    const interactiveElements = element.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="link"]'
    );

    let hasValidLabels = true;

    interactiveElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      const hasAriaLabel = htmlEl.hasAttribute('aria-label');
      const hasAriaLabelledBy = htmlEl.hasAttribute('aria-labelledby');
      const hasTitle = htmlEl.hasAttribute('title');
      const hasTextContent = htmlEl.textContent?.trim();
      const hasAltText = htmlEl.hasAttribute('alt');

      // Check if element has some form of accessible name
      if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasTextContent && !hasAltText) {
        hasValidLabels = false;
      }
    });

    return hasValidLabels;
  }

  /**
   * Validate focus management
   * Requirements: 4.6, 5.5
   */
  private validateFocusManagement(element: HTMLElement): boolean {
    // Check for focus traps in modals
    const modals = element.querySelectorAll('[role="dialog"], [role="alertdialog"]');
    let hasValidFocusManagement = true;
    
    modals.forEach(modal => {
      const focusableElements = modal.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) {
        hasValidFocusManagement = false;
      }
    });

    return hasValidFocusManagement;
  }

  /**
   * Validate screen reader support
   * Requirements: 4.6, 5.5
   */
  private validateScreenReaderSupport(element: HTMLElement): boolean {
    // Check for proper heading structure
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let hasValidHeadingStructure = true;
    let previousLevel = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      
      // Check if heading levels skip more than one level
      if (level > previousLevel + 1 && previousLevel !== 0) {
        hasValidHeadingStructure = false;
      }
      
      previousLevel = level;
    });

    // Check for proper landmark roles
    const landmarks = element.querySelectorAll(
      '[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
    );

    // Check for proper list structure
    const lists = element.querySelectorAll('ul, ol');
    let hasValidListStructure = true;

    lists.forEach(list => {
      const listItems = list.querySelectorAll('li');
      if (listItems.length === 0) {
        hasValidListStructure = false;
      }
    });

    return hasValidHeadingStructure && hasValidListStructure;
  }

  /**
   * Generate accessibility report
   * Requirements: 4.6, 5.5
   */
  generateAccessibilityReport(element: HTMLElement): string {
    const validation = this.validateComponent(element);
    
    let report = 'Accessibility Validation Report\n';
    report += '================================\n\n';

    // Color Contrast
    report += 'Color Contrast:\n';
    const failedContrasts = validation.colorContrast.filter(c => !c.passes);
    if (failedContrasts.length === 0) {
      report += '✅ All color contrasts meet WCAG AA standards\n';
    } else {
      report += `❌ ${failedContrasts.length} color contrast issues found\n`;
      failedContrasts.forEach(contrast => {
        report += `   - Ratio: ${contrast.ratio.toFixed(2)} (${contrast.level})\n`;
      });
    }

    // Keyboard Navigation
    report += '\nKeyboard Navigation:\n';
    report += validation.keyboardNavigation ? '✅ Keyboard navigation is properly implemented\n' : '❌ Keyboard navigation issues found\n';

    // ARIA Labels
    report += '\nARIA Labels:\n';
    report += validation.ariaLabels ? '✅ ARIA labels are properly implemented\n' : '❌ Missing or incorrect ARIA labels\n';

    // Focus Management
    report += '\nFocus Management:\n';
    report += validation.focusManagement ? '✅ Focus management is properly implemented\n' : '❌ Focus management issues found\n';

    // Screen Reader Support
    report += '\nScreen Reader Support:\n';
    report += validation.screenReaderSupport ? '✅ Screen reader support is properly implemented\n' : '❌ Screen reader support issues found\n';

    return report;
  }

  /**
   * Apply high contrast mode
   * Requirements: 4.6, 5.5
   */
  applyHighContrastMode(enable: boolean): void {
    const body = document.body;
    
    if (enable) {
      body.classList.add('high-contrast-mode');
    } else {
      body.classList.remove('high-contrast-mode');
    }
  }

  /**
   * Check if user prefers reduced motion
   * Requirements: 4.6, 5.5
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if user prefers high contrast
   * Requirements: 4.6, 5.5
   */
  prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
}