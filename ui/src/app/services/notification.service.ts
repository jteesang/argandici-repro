import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private idCounter = 0;

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) {
    const toast: Toast = {
      id: this.idCounter++,
      type,
      message,
      duration
    };

    this.toasts.push(toast);
    this.toastsSubject.next([...this.toasts]);

    if (duration) {
      setTimeout(() => this.removeToast(toast.id), duration);
    }
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }
}
