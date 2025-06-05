import { Component, Input } from '@angular/core';
import { NotificationService, Toast } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @Input() toast!: Toast;

  get iconClass(): string {
    switch (this.toast.type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      default: return 'fas fa-info-circle';
    }
  }

  get bgClass(): string {
    switch (this.toast.type) {
      case 'success': return 'bg-green-100 border-green-200';
      case 'error': return 'bg-red-100 border-red-200';
      case 'warning': return 'bg-yellow-100 border-yellow-200';
      default: return 'bg-blue-100 border-blue-200';
    }
  }

  get textClass(): string {
    switch (this.toast.type) {
      case 'success': return 'text-green-700';
      case 'error': return 'text-red-700';
      case 'warning': return 'text-yellow-700';
      default: return 'text-blue-700';
    }
  }

  constructor(private notificationService: NotificationService) { }

  close() {
    this.notificationService.removeToast(this.toast.id);
  }
}
