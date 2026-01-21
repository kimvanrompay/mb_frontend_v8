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

        await this.loadLanguage(langToUse);
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
        }
    }

    /**
     * Change current language
     */
    async setLanguage(lang: string): Promise<void> {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Language ${lang} not supported`);
            return;
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
     * Translate a key
     */
    translate(key: string, params?: any): string {
        const lang = this.currentLang$.value;
        const translation = this.getNestedValue(this.translations[lang], key);

        if (!translation) {
            console.warn(`Translation not found for key: ${key} in language: ${lang}`);
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
