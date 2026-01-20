import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification';

@Component({
  selector: 'app-notification-toast',
  imports: [CommonModule],
  templateUrl: './notification-toast.html',
  styleUrl: './notification-toast.css',
})
export class NotificationToastComponent {
  notifications$;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }

  close(id: string): void {
    this.notificationService.remove(id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  }

  getColors(type: string): { bg: string; border: string; text: string; icon: string } {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-400',
          text: 'text-green-800',
          icon: 'text-green-400'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-400',
          text: 'text-red-800',
          icon: 'text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-400',
          text: 'text-yellow-800',
          icon: 'text-yellow-400'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-400',
          text: 'text-blue-800',
          icon: 'text-blue-400'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-400',
          text: 'text-gray-800',
          icon: 'text-gray-400'
        };
    }
  }
}
