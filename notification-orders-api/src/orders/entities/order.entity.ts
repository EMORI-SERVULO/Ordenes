/* eslint-disable prettier/prettier */
// src/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  products: { name: string; quantity: number; price: number }[];

  @Column()
  total: number;

  @CreateDateColumn()
  date: Date;

  @Column({ default: 'pending'})
  status: string;

  @ManyToOne(() => User, user => user.orders, {eager: true})
  user: User;
}
