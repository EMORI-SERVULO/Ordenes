import { type CreateOrder, type UpdateOrder } from "../interface/order.interface";

const API = "http://localhost:3000";
const token = localStorage.getItem("token");

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`, // o tu método preferido
});
//export const getOrdersRequest = async () => fetch(`${API}/orders`);
export const getOrdersRequest = async () => 
  await fetch(`${API}/orders`, {headers: getAuthHeaders(),});
/*
  if (!res.ok) {
    console.error("Error en la solicitud:", res.statusText);
    return null;
  }
*/
 // return await res.json();
  //console.log("Datos recibidos:", data);
  //return data;



export const createOrderRequest = async (order: CreateOrder) =>

  fetch(`${API}/orders`, {
    method: "POST",
    body: JSON.stringify(order),
    headers: getAuthHeaders(),
  });

export const deleteOrderRequest = async (id: string) =>
  fetch(`${API}/orders/${id}`, {
    method: "DELETE",
  });

export const updateOrderRequest = async (id: string, order: UpdateOrder) =>
  fetch(`${API}/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(order),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getOrderRequest = async (id: string) => fetch(`${API}/orders/${id}`);