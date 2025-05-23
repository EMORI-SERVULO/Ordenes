// src/orders/orders.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Any } from 'typeorm';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockUserRepo = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockOrderRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockRabbit = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: RabbitMQService, useValue: mockRabbit },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should create an order and publish to RabbitMQ', async () => {
    const dto:CreateOrderDto  = {
      userId: 1,
      products: [
        { name: 'mesas', quantity: 2, price: 10 },
        { name: 'libros', quantity: 1, price: 15 },
      ],
      date: new Date,
      total: 0,
      status: 'pending',
    };

    const user = { id: 1, name: 'User_1' };
    const order = { id: 123, user, total: 35, products: dto.products };

    mockUserRepo.findOneBy.mockResolvedValue(null);
    mockUserRepo.create.mockReturnValue(user);
    mockUserRepo.save.mockResolvedValue(user);

    mockOrderRepo.create.mockReturnValue(order);
    mockOrderRepo.save.mockResolvedValue(order);

    const result = await service.create(dto);

    expect(result).toEqual(order);
    expect(mockUserRepo.create).toHaveBeenCalledWith({ id: 1, name: 'User_1' });
    expect(mockOrderRepo.save).toHaveBeenCalledWith(order);
    expect(mockRabbit.send).toHaveBeenCalledWith('order.created', {
      orderId: 123,
      userId: 1,
    });
  });
});

