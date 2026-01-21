import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Pipe({
    name: 't',
    standalone: true,
    pure: false // Re-evaluate when language changes
})
export class TranslatePipe implements PipeTransform {
    constructor(private i18n: I18nService) { }

    transform(key: string, params?: any): string {
        return this.i18n.translate(key, params);
    }
}
