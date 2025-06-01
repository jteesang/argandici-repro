import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItemDto {
  productId: string;
  quantity: number;
}

export interface ShippingDto {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  shipping: ShippingDto;
  email?: string;
}

export interface CreateOrderResponse {
  id: string;
  userId: string | null;
  email: string | null;
  total: number;
  status: string;
  date: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  items: any[];
  checkoutUrl: string; // URL de redirection Stripe
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  createOrder(dto: CreateOrderDto): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(this.apiUrl, dto);
  }

  // Ajoutez d’autres méthodes (findAll, findOne, etc.) si besoin
}
