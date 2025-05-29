import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss'],
})
export class InfoBarComponent {
  messages = [
    'Livraison gratuite à partir de 150 € (Europe & DOM-TOM)',
    'Paiement sécurisé – CB & Paypal'
  ];
}
