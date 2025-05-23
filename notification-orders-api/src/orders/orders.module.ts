import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  imports:[TypeOrmModule.forFeature([Order,User])],
  providers: [OrdersService, RabbitMQService],
  controllers: [OrdersController]
})
export class OrdersModule {}
