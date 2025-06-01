import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  product: Product | null = null;
  isLoading = true;
  selectedImage: string | null = null;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.selectedImage = product.image;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading product', err);
          this.isLoading = false;
        }
      });
    }
  }

  changeImage(img: string) {
    this.selectedImage = img;
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      // On prend l’image principale (product.image) ou selectedImage
      this.cartService.addToCart({
        productId: this.product.id,
        name: this.product.name,
        price: this.product.price,
        image: this.product.image,
      }, this.quantity);

      // Optionnel : afficher un toast / notification
      alert(`Ajouté ${this.quantity} x "${this.product.name}" au panier.`);
    }
  }
}
