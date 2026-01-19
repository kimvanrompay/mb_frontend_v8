import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  show(message: string, type: NotificationType = 'info', title?: string, duration: number = 5000): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      title,
      duration
    };

    const current = this.notifications.value;
    this.notifications.next([...current, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(notification.id), duration);
    }
  }

  success(message: string, title?: string, duration: number = 5000): void {
    this.show(message, 'success', title, duration);
  }

  error(message: string, title?: string, duration: number = 7000): void {
    this.show(message, 'error', title, duration);
  }

  warning(message: string, title?: string, duration: number = 6000): void {
    this.show(message, 'warning', title, duration);
  }

  info(message: string, title?: string, duration: number = 5000): void {
    this.show(message, 'info', title, duration);
  }

  remove(id: string): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.id !== id));
  }

  clear(): void {
    this.notifications.next([]);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
