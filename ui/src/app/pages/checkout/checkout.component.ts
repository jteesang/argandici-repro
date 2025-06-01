import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  items: CartItem[] = [];
  total = 0;

  checkoutForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.cartItems$ = this.cartService.cart$;
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      // On suppose que si l'utilisateur est connecté, on récupère son email en front automatiquement (via un AuthService éventuel)
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.cartItems$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  async submitOrder() {
    if (this.checkoutForm.invalid || this.items.length === 0) {
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = null;

    // Préparation DTO pour l'API
    const dto = {
      items: this.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      shipping: {
        fullName: this.checkoutForm.value.fullName,
        addressLine1: this.checkoutForm.value.addressLine1,
        addressLine2: this.checkoutForm.value.addressLine2,
        city: this.checkoutForm.value.city,
        postalCode: this.checkoutForm.value.postalCode,
        country: this.checkoutForm.value.country,
      },
      email: this.checkoutForm.value.email,
    };

    try {
      const response = await this.orderService
        .createOrder(dto)
        .toPromise();
      const checkoutUrl = response?.checkoutUrl;
      if (!checkoutUrl) {
        throw new Error('URL de paiement non reçue');
      }
      this.cartService.clearCart();
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error('Erreur création commande :', err);
      this.errorMessage =
        err.error?.message || 'Erreur lors de la création de la commande.';
      this.isSubmitting = false;
    }
  }
}
