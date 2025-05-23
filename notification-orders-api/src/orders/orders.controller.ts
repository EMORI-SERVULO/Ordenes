/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor (private readonly ordersService: OrdersService) {}

    @Post()
    create(@Body() dto: CreateOrderDto, @Request() req: any) {
        return this.ordersService.create({...dto, userId: req.user.userId,});
    }

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(Number(id));
    }
}
