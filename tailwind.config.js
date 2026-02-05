/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'IBM Plex Mono', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        // Material Design 3 Color System
        primary: '#0F5132',
        'primary-container': '#C4EED0',
        'on-primary': '#FFFFFF',
        'on-primary-container': '#052112',
        
        secondary: '#526350',
        'secondary-container': '#D4E8CF',
        'on-secondary': '#FFFFFF',
        'on-secondary-container': '#101F0F',
        
        tertiary: '#006874',
        'tertiary-container': '#97F0FF',
        'on-tertiary-container': '#001F24',
        
        error: '#BA1A1A',
        'error-container': '#FFDAD6',
        
        // Surface Hierarchy
        surface: '#FEF7FF',
        'surface-dim': '#DED8E1',
        'surface-bright': '#FEF7FF',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F7F2FA',
        'surface-container': '#F3EDF7',
        'surface-container-high': '#ECE6F0',
        'surface-container-highest': '#E6E0E9',
        
        'on-surface': '#1C1B1F',
        'on-surface-variant': '#49454F',
        
        // Outlines & Borders
        outline: '#79747E',
        'outline-variant': '#C4C7C5',
        
        // Inverse (for dark mode)
        'inverse-surface': '#313033',
        'inverse-on-surface': '#F4EFF4',
        'inverse-primary': '#7EDBA6',
      },
      borderRadius: {
        // M3 Corner Radius System
        'm3-none': '0px',
        'm3-xs': '4px',
        'm3-sm': '8px',
        'm3-md': '12px',
        'm3-lg': '16px',
        'm3-xl': '28px',
        'm3-full': '9999px',
      },
      boxShadow: {
        // M3 Elevation System
        'm3-1': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'm3-2': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'm3-3': '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
        'm3-4': '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
        'm3-5': '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
