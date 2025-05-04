import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ShippingProvider, ShippingStatus } from '@prisma/client';

export class UpdateShippingDto {
  @IsOptional()
  @IsEnum(ShippingProvider)
  shippingProvider?: ShippingProvider;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsEnum(ShippingStatus)
  shippingStatus?: ShippingStatus;
}
