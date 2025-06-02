import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.scss'],
})
export class ProductsSectionComponent {
  products = [
    {
      name: 'Argan Cosmétique',
      description: 'Pour une peau nourrie et des cheveux revitalisés',
      price: 'À partir de 24€',
      image: 'assets/images/asset_1.jpg'
    },
    {
      name: 'Argan Culinaire',
      description: 'L\'huile gourmande aux notes de noisette',
      price: 'À partir de 28€',
      image: 'assets/images/asset_2.jpg'
    },
    {
      name: 'Collection Prestige',
      description: 'L\'huile d\'argan la plus rare et la plus pure',
      price: 'À partir de 42€',
      image: 'assets/images/asset_3.jpg'
    }
  ];
}
