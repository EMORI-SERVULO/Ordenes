/* eslint-disable prettier/prettier */
// src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private rabbitService: RabbitMQService
  ) {}

async create(dto: CreateOrderDto) {
  const user = await this.userRepo.findOneBy({ id: dto.userId });

  if (!user) {
    //throw new Error(`User with ID ${dto.userId} not found`);
    const new_user = this.userRepo.create({
      id: dto.userId,
      name: `User_${dto.userId}`,
    });
    await this.userRepo.save(new_user);
  }
  
  const total = dto.products.reduce((acc, p) => acc + p.quantity * p.price, 0);

  const order = this.orderRepo.create({ ...user, products: dto.products, total });
  const savedOrder = await this.orderRepo.save(order);

  // Enviar evento a RabbitMQ
  await this.rabbitService.send('order.created', {
    orderId: savedOrder.id,
    userId: user?.id, // usa directamente el ID conocido
  });

  return savedOrder;
}

  findAll() {
    return this.orderRepo.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.orderRepo.findOne({ where: { id }, relations: ['user'] });
  }
}

