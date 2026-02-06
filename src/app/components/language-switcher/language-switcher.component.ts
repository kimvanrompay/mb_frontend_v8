import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button
        *ngFor="let lang of languages"
        (click)="switchLanguage(lang.code)"
        [class.active]="currentLanguage === lang.code"
        class="lang-button"
        [attr.aria-label]="'Switch to ' + lang.name">
        {{ lang.flag }} {{ lang.name }}
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .lang-button {
      background: none;
      border: none;
      padding: 4px 8px;
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .lang-button:hover {
      background-color: rgba(0, 0, 0, 0.04);
      color: var(--mat-sys-on-surface);
    }

    .lang-button.active {
      color: var(--mat-sys-primary);
      font-weight: 500;
    }

    .lang-button:focus {
      outline: 2px solid var(--mat-sys-primary);
      outline-offset: 2px;
    }
  `]
})
export class LanguageSwitcherComponent {
  languages: Language[] = [
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'nl', name: 'NL', flag: '🇳🇱' },
    { code: 'fr', name: 'FR', flag: '🇫🇷' },
    { code: 'de', name: 'DE', flag: '🇩🇪' },
    { code: 'es', name: 'ES', flag: '🇪🇸' }
  ];

  currentLanguage: string;

  constructor(private i18nService: I18nService) {
    this.currentLanguage = this.i18nService.getCurrentLanguage();
  }

  switchLanguage(langCode: string) {
    this.i18nService.setLanguage(langCode);
    this.currentLanguage = langCode;
  }
}
