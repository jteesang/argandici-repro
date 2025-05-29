import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newsletter-section',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newsletter-section.component.html',
  styleUrl: './newsletter-section.component.scss',
  standalone: true,
})
export class NewsletterSectionComponent {
  emailControl = new FormControl('');

  onSubmit() {
    if (this.emailControl.valid) {
      console.log('Email submitted:', this.emailControl.value);
      // Ici, ajouter la logique d'envoi à votre backend
      this.emailControl.reset();
    }
  }
}
