import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationToastComponent } from './components/notification-toast/notification-toast';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Meribas');

  constructor(private translationService: TranslationService) {
    // Translation service automatically initializes and detects browser language
  }
}
