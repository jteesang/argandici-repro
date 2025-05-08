import {
  IsArray,
  ValidateNested,
  IsUUID,
  IsInt,
  Min,
  IsOptional,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

class ShippingDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  addressLine1: string;

  @IsOptional()
  addressLine2?: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  postalCode: string;

  @IsNotEmpty()
  country: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateNested()
  @Type(() => ShippingDto)
  shipping: ShippingDto;
}
