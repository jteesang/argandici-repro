import { Controller, Get, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/stock')
  updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.productsService.updateStock(id, dto.stock);
  }
}
