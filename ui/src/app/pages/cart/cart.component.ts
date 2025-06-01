import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  items: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cart$;
  }

  ngOnInit() {
    this.cartItems$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  onQuantityChange(item: CartItem, newQty: number) {
    this.cartService.updateQuantity(item.productId, newQty);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.productId);
  }

  clearCart() {
    if (confirm('Vider complètement le panier ?')) {
      this.cartService.clearCart();
    }
  }
}
