import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FaqComponent {
  faqList = [
    {
      question: "Qu'est-ce que l'huile d'argan ?",
      answer: "L'huile d'argan est une huile végétale précieuse, extraite des fruits de l'arganier, reconnue pour ses bienfaits alimentaires et cosmétiques.",
    },
    {
      question: "Comment garantissez-vous la qualité de l'huile ?",
      answer: "Notre huile est produite de façon artisanale, contrôlée à chaque étape et testée en laboratoire. Nous sélectionnons les meilleurs producteurs familiaux au Maroc.",
    },
    {
      question: "Livrez-vous partout en France ?",
      answer: "Oui, nous livrons partout en France métropolitaine via Colissimo ou Mondial Relay.",
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      answer: "Nous acceptons Carte bancaire, Apple Pay, Google Pay et Paypal via notre module de paiement sécurisé.",
    },
    {
      question: "Comment vous contacter ?",
      answer: "Vous pouvez nous joindre via le formulaire de contact ou par email à contact@argandici.com.",
    }
    // Ajoute autant de questions/réponses que tu veux !
  ];

  openIndex: number | null = null;
  toggle(i: number) {
    this.openIndex = this.openIndex === i ? null : i;
  }
}
