/**
 * Color Utilities for Brand Customization
 * Implements WCAG contrast ratio calculations for accessibility
 */

export class ColorUtils {
  /**
   * Calculate relative luminance of a color (WCAG 2.0 formula)
   * @param hex Hex color code (e.g., "#0000FF" or "#00F")
   * @returns Relative luminance value (0-1)
   */
  static getRelativeLuminance(hex: string): number {
    // Remove # if present
    hex = hex.replace('#', '');

    // Handle 3-character hex codes
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Apply gamma correction (WCAG formula)
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    // Calculate luminance
    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
  }

  /**
   * Calculate contrast ratio between two colors (WCAG 2.0)
   * @param color1 First hex color
   * @param color2 Second hex color
   * @returns Contrast ratio (1-21)
   */
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getRelativeLuminance(color1);
    const lum2 = this.getRelativeLuminance(color2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get the best contrasting text color (white or black) for a background
   * Uses WCAG AA standard (4.5:1 for normal text)
   * @param backgroundColor Background hex color
   * @returns '#FFFFFF' or '#000000'
   */
  static getContrastingTextColor(backgroundColor: string): string {
    const whiteContrast = this.getContrastRatio(backgroundColor, '#FFFFFF');
    const blackContrast = this.getContrastRatio(backgroundColor, '#000000');

    // Return the color with better contrast
    // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
  }

  /**
   * Check if a color combination meets WCAG AA standards
   * @param foreground Foreground hex color
   * @param background Background hex color
   * @param largeText Whether the text is large (18pt+ or 14pt+ bold)
   * @returns true if meets WCAG AA standards
   */
  static meetsWCAGAA(foreground: string, background: string, largeText: boolean = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return largeText ? ratio >= 3 : ratio >= 4.5;
  }

  /**
   * Check if a color combination meets WCAG AAA standards
   * @param foreground Foreground hex color
   * @param background Background hex color
   * @param largeText Whether the text is large
   * @returns true if meets WCAG AAA standards
   */
  static meetsWCAGAAA(foreground: string, background: string, largeText: boolean = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return largeText ? ratio >= 4.5 : ratio >= 7;
  }

  /**
   * Lighten a color by a percentage
   * @param hex Hex color code
   * @param percent Percentage to lighten (0-100)
   * @returns Lightened hex color
   */
  static lighten(hex: string, percent: number): string {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * percent);

    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);

    return '#' + (
      0x1000000 +
      (R * 0x10000) +
      (G * 0x100) +
      B
    ).toString(16).slice(1).toUpperCase();
  }

  /**
   * Darken a color by a percentage
   * @param hex Hex color code
   * @param percent Percentage to darken (0-100)
   * @returns Darkened hex color
   */
  static darken(hex: string, percent: number): string {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * percent);

    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);

    return '#' + (
      0x1000000 +
      (R * 0x10000) +
      (G * 0x100) +
      B
    ).toString(16).slice(1).toUpperCase();
  }

  /**
   * Validate hex color format
   * @param hex Color to validate
   * @returns true if valid hex color
   */
  static isValidHex(hex: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }
}
