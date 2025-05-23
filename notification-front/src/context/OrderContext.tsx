import { createContext, useEffect, useState } from "react";
import type { CreateOrder, Order, UpdateOrder } from "../interface/order.interface";
import {
  createOrderRequest,
  deleteOrderRequest,
  getOrdersRequest,
  updateOrderRequest,
} from "../api/orders";

interface OrderContextValue {
  orders: Order[];
  createOrder: (order: CreateOrder) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrder: (id: string, order: UpdateOrder) => Promise<void>;
}

export const OrderContext = createContext<OrderContextValue>({
  orders: [],
  createOrder: async () => {
    throw new Error("createOrder() not implemented");
  },
  deleteOrder: async () => {
    throw new Error("deleteOrder() not implemented");
  },
  updateOrder: async () => {
    throw new Error("updateOrder() not implemented");
  },
});

interface Props {
  children: React.ReactNode;
}

export const OrderProvider: React.FC<Props> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrdersRequest()
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, []);

  const createOrder = async (order: CreateOrder) => {
    console.log('dato enviado',order)
    const response = await createOrderRequest(order);
    const data = await response.json();
    setOrders([...orders, data]);
  };

  const deleteOrder = async (id: string) => {
    const response = await deleteOrderRequest(id);
    console.log(response)
    if (response.status === 204) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const updateOrder = async (id: string, order: UpdateOrder) => {
    const response = await updateOrderRequest(id, order);
    const data = await response.json();
    console.log(data)
    setOrders(
      orders.map((order) => (order.id === id ? { ...order, ...data } : order))
    );
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, deleteOrder, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};