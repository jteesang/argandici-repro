import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule]
})
export class ContactComponent {
  contactForm: FormGroup;
  loading = false;
  success = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.success = false;
    this.error = false;

    const formData = this.contactForm.value;

    this.http.post('/api/contact', formData).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.contactForm.reset();
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => this.success = false, 5000);
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du formulaire', err);
        this.loading = false;
        this.error = true;
      }
    });
  }
}
