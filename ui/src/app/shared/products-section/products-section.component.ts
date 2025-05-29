import { Component } from '@angular/core';

@Component({
  selector: 'app-products-section',
  imports: [],
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.scss',
  standalone: true,
})
export class ProductsSectionComponent {
  products = [
    {
      name: 'Argan Cosmétique',
      description: 'Pour une peau nourrie et des cheveux revitalisés',
      price: 'À partir de 24€',
      image: '/ui/src/assets/images/asset_1.jpg'
    },
    {
      name: 'Argan Culinaire',
      description: 'L\'huile gourmande aux notes de noisette',
      price: 'À partir de 28€',
      image: '/ui/src/assets/images/asset_2.jpg'
    },
    {
      name: 'Collection Prestige',
      description: 'L\'huile d\'argan la plus rare et la plus pure',
      price: 'À partir de 42€',
      image: '/ui/src/assets/images/asset_3.jpg'
    }
  ];
}
