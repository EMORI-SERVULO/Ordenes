interface Product {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
    id: string;
    title: string;
    description?: string;
    done?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    date?: Date;
    products: Product[];
    status: string;
    total: number;
    user: string;
}

export type CreateOrder = Omit<Order, "id" | "createdAt" | "updatedAt">;

export type UpdateOrder = Partial<CreateOrder>;