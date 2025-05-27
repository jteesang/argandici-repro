import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ProductsComponent {
  products = [
    {
      name: "Huile d'argan alimentaire 100ml",
      price: 14.90,
      img: "assets/argan-nature.jpg",
      description: "Huile d'argan 100% pure, pressée à froid, idéale en cuisine et en soin santé."
    },
    {
      name: "Huile d'argan cosmétique 50ml",
      price: 11.90,
      img: "assets/argan-cosmetic.jpg",
      description: "Huile d'argan bio pour visage, corps et cheveux. Hydrate, protège et régénère."
    },
    {
      name: "Huile d'argan parfumée à la rose 50ml",
      price: 13.90,
      img: "assets/argan-rose.jpg",
      description: "Un soin unique à la rose pour peaux sensibles, parfum doux et naturel."
    }
    // Ajoute tes vrais produits ici !
  ];
}
