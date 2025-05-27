import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ContactComponent {
  form = { name: '', email: '', message: '' };
  sent = false;

  onSubmit() {
    this.sent = true;
    // Ici, tu mettras plus tard la logique pour envoyer le message à l'API
    setTimeout(() => { this.sent = false; }, 4000);
  }
}
