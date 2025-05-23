/* eslint-disable prettier/prettier */
// src/orders/dto/create-order.dto.ts
export class CreateOrderDto {
  userId: number;
  products: { name: string; quantity: number; price: number }[];
  date: Date;
  total: number;
  status: string;
}
