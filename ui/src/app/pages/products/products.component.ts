import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products: Product[] = [];
  categories: string[] = ['Tous', 'Cosmétique', 'Alimentaire', 'Soins'];
  selectedCategory: string = 'Tous';
  isLoading = true;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false;
      }
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'Tous') {
      this.loadProducts();
    } else {
      this.isLoading = true;
      this.productService.getProductsByCategory(category).subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error filtering products', err);
          this.isLoading = false;
        }
      });
    }
  }
}
