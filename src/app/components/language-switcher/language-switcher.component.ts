import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <select 
        [value]="currentLanguage" 
        (change)="onLanguageChange($event)"
        class="lang-select"
        aria-label="Select language">
        <option *ngFor="let lang of languages" [value]="lang.code">
          {{ lang.name }}
        </option>
      </select>
      <span class="material-icons arrow-icon">expand_more</span>
    </div>
  `,
  styles: [`
    .language-switcher {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    .lang-select {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      padding: 6px 28px 6px 12px;
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
      cursor: pointer;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
      min-width: 80px;
    }

    .lang-select:hover {
      border-color: var(--mat-sys-primary);
      color: var(--mat-sys-on-surface);
    }

    .lang-select:focus {
      border-color: var(--mat-sys-primary);
      box-shadow: 0 0 0 2px rgba(15, 81, 50, 0.1);
    }

    .arrow-icon {
      position: absolute;
      right: 8px;
      pointer-events: none;
      font-size: 18px;
      color: var(--mat-sys-on-surface-variant);
    }
  `]
})
export class LanguageSwitcherComponent {
  languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' }
  ];

  currentLanguage: string;

  constructor(private i18nService: I18nService) {
    this.currentLanguage = this.i18nService.getCurrentLanguage();
  }

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const langCode = select.value;
    this.i18nService.setLanguage(langCode);
    this.currentLanguage = langCode;
  }
}
