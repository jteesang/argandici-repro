import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Un item de panier : productId, nom, prix unitaire et quantité.
 */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string; // chemin relatif (ex. "/assets/images/bottle_asset.png")
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'argandici_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());

  constructor() {
    // À chaque mise à jour du panier, on réécrit dans localStorage
    this.cart$.subscribe(items => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    });
  }

  /** Observable du contenu du panier */
  get cart$(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  /** Récupère la valeur courante (tableau d’items) */
  private get currentCart(): CartItem[] {
    return this.cartSubject.getValue();
  }

  /** Charge depuis localStorage au démarrage */
  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Erreur lecture panier depuis localStorage :', e);
    }
    return [];
  }

  /** Ajoute un produit au panier (ou incrémente la quantité si déjà présent) */
  addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    const cart = [...this.currentCart];
    const idx = cart.findIndex(ci => ci.productId === item.productId);
    if (idx > -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }
    this.cartSubject.next(cart);
  }

  /** Retire entièrement un item du panier */
  removeItem(productId: string) {
    const cart = this.currentCart.filter(ci => ci.productId !== productId);
    this.cartSubject.next(cart);
  }

  /** Change la quantité d’un item (met à jour à la quantité passée, si <= 0 on supprime) */
  updateQuantity(productId: string, quantity: number) {
    let cart = [...this.currentCart];
    const idx = cart.findIndex(ci => ci.productId === productId);
    if (idx === -1) return;
    if (quantity <= 0) {
      cart = cart.filter(ci => ci.productId !== productId);
    } else {
      cart[idx].quantity = quantity;
    }
    this.cartSubject.next(cart);
  }

  /** Vide totalement le panier */
  clearCart() {
    this.cartSubject.next([]);
  }

  /** Calcule le montant total HT du panier */
  getTotal(): number {
    return this.currentCart.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  }
}
