export class CreateOrderDto {
  items: {
    productId: string;
    quantity: number;
  }[];
  email?: string; // champ requis si invité
}
