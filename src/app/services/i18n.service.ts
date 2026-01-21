import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TranslationData {
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private translations: { [lang: string]: TranslationData } = {};
    private currentLang$ = new BehaviorSubject<string>('en');
    private supportedLanguages = ['en', 'nl'];
    private defaultLanguage = 'en';

    constructor(private http: HttpClient) {
        this.initializeLanguage();
    }

    /**
     * Initialize language from browser or localStorage
     */
    private async initializeLanguage(): Promise<void> {
        // Always load English first as fallback
        await this.loadLanguage(this.defaultLanguage);

        // Check localStorage first
        const savedLang = localStorage.getItem('app_language');

        let langToUse = this.defaultLanguage;

        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            langToUse = savedLang;
        } else {
            // Detect browser language
            const browserLang = this.getBrowserLanguage();
            if (this.supportedLanguages.includes(browserLang)) {
                langToUse = browserLang;
            }
        }

        // Load the selected language (if different from English)
        if (langToUse !== this.defaultLanguage) {
            await this.loadLanguage(langToUse);
        }

        this.currentLang$.next(langToUse);
    }

    /**
     * Get browser language
     */
    private getBrowserLanguage(): string {
        const lang = navigator.language || (navigator as any).userLanguage;
        return lang ? lang.split('-')[0].toLowerCase() : this.defaultLanguage;
    }

    /**
     * Load translation file
     */
    private async loadLanguage(lang: string): Promise<void> {
        if (this.translations[lang]) {
            return; // Already loaded
        }

        try {
            const data = await this.http.get<TranslationData>(`./assets/i18n/${lang}.json`).toPromise();
            this.translations[lang] = data || {};
        } catch (error) {
            console.error(`Failed to load language: ${lang}`, error);
            this.translations[lang] = {};

            // If failed to load non-English, ensure English is available
            if (lang !== this.defaultLanguage && !this.translations[this.defaultLanguage]) {
                await this.loadLanguage(this.defaultLanguage);
            }
        }
    }

    /**
     * Change current language
     */
    async setLanguage(lang: string): Promise<void> {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Language ${lang} not supported, using ${this.defaultLanguage}`);
            lang = this.defaultLanguage;
        }

        await this.loadLanguage(lang);
        this.currentLang$.next(lang);
        localStorage.setItem('app_language', lang);
    }

    /**
     * Get current language
     */
    getCurrentLanguage(): string {
        return this.currentLang$.value;
    }

    /**
     * Get current language as observable
     */
    getCurrentLanguage$(): Observable<string> {
        return this.currentLang$.asObservable();
    }

    /**
     * Translate a key with fallback to English
     */
    translate(key: string, params?: any): string {
        const lang = this.currentLang$.value;
        let translation = this.getNestedValue(this.translations[lang], key);

        // Fallback to English if translation not found in current language
        if (!translation && lang !== this.defaultLanguage) {
            translation = this.getNestedValue(this.translations[this.defaultLanguage], key);

            if (translation) {
                console.warn(`Translation for "${key}" not found in ${lang}, using English fallback`);
            }
        }

        // If still not found, return the key itself
        if (!translation) {
            console.warn(`Translation not found for key: ${key} in any language`);
            return key;
        }

        // Replace parameters if provided
        if (params && typeof translation === 'string') {
            return this.replaceParams(translation, params);
        }

        return translation;
    }

    /**
     * Get nested value from object using dot notation
     */
    private getNestedValue(obj: any, path: string): any {
        if (!obj) return undefined;
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    /**
     * Replace {{param}} placeholders with values
     */
    private replaceParams(text: string, params: any): string {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages(): string[] {
        return this.supportedLanguages;
    }
}
