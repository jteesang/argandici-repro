import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
})
export class NavbarComponent {
  menuOpen = false;

  /** Observable du nombre total d’articles dans le panier */
  cartCount$!: Observable<number>;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartCount$ = this.cartService.cart$.pipe(
      map(items => items.reduce((sum, i) => sum + i.quantity, 0))
    );
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu() {
    this.menuOpen = false;
  }
}
