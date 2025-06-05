import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' })),
      ]),
    ]),
    trigger('totalAnimation', [
      transition(':increment', [
        animate('300ms', style({ color: '#c9a145', transform: 'scale(1.1)' })),
        animate('300ms', style({ color: 'inherit', transform: 'scale(1)' })),
      ]),
      transition(':decrement', [
        animate('300ms', style({ color: '#c9a145', transform: 'scale(1.1)' })),
        animate('300ms', style({ color: 'inherit', transform: 'scale(1)' })),
      ]),
    ]),
  ]
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  items: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {
    this.cartItems$ = this.cartService.cart$;
  }

  ngOnInit() {
    this.cartItems$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  onQuantityChange(item: CartItem, newQty: number) {
    if (newQty < 1) {
      this.removeItem(item);
      return;
    }
    this.cartService.updateQuantity(item.productId, newQty);
    this.notificationService.showToast('Quantité mise à jour', 'success');
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.productId);
    this.notificationService.showToast('Produit retiré du panier', 'info');
  }

  clearCart() {
    this.cartService.clearCart();
    this.notificationService.showToast('Panier vidé', 'info');
  }
}
