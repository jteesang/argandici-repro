import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { ToastComponent } from "../toast/toast.component";

@Component({
  selector: 'app-toast-container',
  standalone: true,
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  imports: [CommonModule, ToastComponent]
})
export class ToastContainerComponent {
  constructor(public notificationService: NotificationService) { }
}
