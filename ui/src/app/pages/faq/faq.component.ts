import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FaqComponent {
  faqList = [
    {
      question: "Qu'est-ce que l'huile d'argan ?",
      answer: "L'huile d'argan est une huile végétale précieuse, extraite des fruits de l'arganier, reconnue pour ses bienfaits alimentaires et cosmétiques. Elle est produite exclusivement au Maroc et est souvent appelée 'l'or liquide' en raison de sa valeur et de sa couleur dorée.",
    },
    {
      question: "Comment garantissez-vous la qualité de l'huile ?",
      answer: "Notre huile est produite de façon artisanale, contrôlée à chaque étape et testée en laboratoire. Nous sélectionnons les meilleurs producteurs familiaux au Maroc. Chaque lot est analysé pour garantir sa pureté et son absence de contaminants.",
    },
    {
      question: "Livrez-vous partout en France ?",
      answer: "Oui, nous livrons partout en France métropolitaine via Colissimo ou Mondial Relay. Les délais de livraison sont généralement de 2 à 5 jours ouvrés. Les frais de port sont offerts à partir de 50€ d'achat.",
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      answer: "Nous acceptons Carte bancaire, Apple Pay, Google Pay et Paypal via notre module de paiement sécurisé. Toutes les transactions sont cryptées pour assurer la sécurité de vos données.",
    },
    {
      question: "Comment vous contacter ?",
      answer: "Vous pouvez nous joindre via le formulaire de contact ou par email à contact@argandici.com. Notre équipe vous répondra dans les 24 heures ouvrées. Nous sommes également disponibles par téléphone au 01 23 45 67 89 du lundi au vendredi de 9h à 18h.",
    },
    {
      question: "L'huile d'argan est-elle comestible ?",
      answer: "Non, pour le moment nous ne proposons qu'une seule qualités d'huile d'argan : cosmétique. L'huile alimentaire est torréfiée et possède un délicieux goût de noisette. Elle est idéale pour assaisonner vos plats. Suivez-nous sur nos différents réseaux sociaux pour être informé de son arrivée !",
    },
    {
      question: "Quelle est la différence entre l'huile cosmétique et alimentaire ?",
      answer: "L'huile cosmétique est pressée à froid à partir d'amandons non torréfiés, ce qui préserve ses propriétés pour la peau et les cheveux. L'huile alimentaire est obtenue à partir d'amandons légèrement torréfiés, ce qui lui donne son goût caractéristique et la rend comestible.",
    }
  ];

  openIndex: number | null = null;

  toggle(i: number) {
    this.openIndex = this.openIndex === i ? null : i;
  }
}
