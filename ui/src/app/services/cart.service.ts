import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCart(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
    const cart = this.cartSubject.value;
    const existingItem = cart.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }

    this.saveCart(cart);
  }

  updateQuantity(productId: string, quantity: number) {
    const cart = this.cartSubject.value;
    const item = cart.find(i => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      this.saveCart(cart);
    }
  }

  removeItem(productId: string) {
    const cart = this.cartSubject.value.filter(item => item.productId !== productId);
    this.saveCart(cart);
  }

  clearCart() {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.cartSubject.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
}
