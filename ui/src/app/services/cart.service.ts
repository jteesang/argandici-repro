import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // <--- Inject et PLATFORM_ID sont nécessaires
import { isPlatformBrowser } from '@angular/common'; // <--- isPlatformBrowser est nécessaire
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
  private isBrowser: boolean; // <--- On stocke l'information ici

  constructor(@Inject(PLATFORM_ID) private platformId: object) { // <--- injecte le PLATFORM_ID
    this.isBrowser = isPlatformBrowser(this.platformId); // <--- On vérifie si on est dans un navigateur

    if (this.isBrowser) { // <--- ON PROTÈGE L'ACCÈS
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartSubject.next(JSON.parse(savedCart));
      }
    }
  }

  private saveCart(cart: CartItem[]) {
    if (this.isBrowser) { // <--- ON PROTÈGE L'ACCÈS
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    // On met à jour le BehaviorSubject dans tous les cas (serveur et navigateur)
    // pour que l'état en mémoire de l'application soit cohérent.
    this.cartSubject.next(cart);
  }

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
    // Pas besoin de changer cette méthode, car elle appelle saveCart() qui est maintenant protégée.
    const cart = [...this.cartSubject.value]; // On crée une nouvelle copie pour l'immutabilité
    const existingItem = cart.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }

    this.saveCart(cart);
  }

  updateQuantity(productId: string, quantity: number) {
    const cart = [...this.cartSubject.value];
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
