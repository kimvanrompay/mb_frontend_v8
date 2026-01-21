import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private supportedLanguages = ['en', 'nl', 'fr', 'de']; // Add more as needed
    private defaultLanguage = 'en';

    constructor(private translate: TranslateService) {
        this.initialize();
    }

    /**
     * Initialize translations and detect browser language
     */
    private initialize(): void {
        // Set default language
        this.translate.setDefaultLang(this.defaultLanguage);

        // Get browser language
        const browserLang = this.detectBrowserLanguage();

        // Use browser language if supported, otherwise use default
        const langToUse = this.supportedLanguages.includes(browserLang)
            ? browserLang
            : this.defaultLanguage;

        this.translate.use(langToUse);

        console.log(`Language initialized: ${langToUse} (Browser: ${browserLang})`);
    }

    /**
     * Detect browser language
     */
    private detectBrowserLanguage(): string {
        // Try navigator.language first (e.g., "en-US", "nl-NL")
        let browserLang = navigator.language || (navigator as any).userLanguage;

        // Extract just the language code (e.g., "en" from "en-US")
        if (browserLang) {
            browserLang = browserLang.split('-')[0].toLowerCase();
        }

        return browserLang || this.defaultLanguage;
    }

    /**
     * Change language manually
     */
    setLanguage(lang: string): void {
        if (this.supportedLanguages.includes(lang)) {
            this.translate.use(lang);
            localStorage.setItem('preferred_language', lang);
            console.log(`Language changed to: ${lang}`);
        }
    }

    /**
     * Get current language
     */
    getCurrentLanguage(): string {
        return this.translate.currentLang || this.defaultLanguage;
    }

    /**
     * Get list of supported languages
     */
    getSupportedLanguages(): string[] {
        return this.supportedLanguages;
    }

    /**
     * Translate a key instantly (returns Observable)
     */
    translate$(key: string, params?: any) {
        return this.translate.get(key, params);
    }

    /**
     * Translate a key instantly (returns string)
     */
    instant(key: string, params?: any): string {
        return this.translate.instant(key, params);
    }
}
