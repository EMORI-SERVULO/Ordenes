import OrderItem from "./OrderItem";
import { useOrders } from "../context/useOrders";

function OrderList() {
  const { orders } = useOrders();
  
  if (!orders.length)
    return <p className="text-center text-xl font-bold my-4">No hay ordenes</p>;

  return (
    <div>
      {orders.map((order) => (
        <OrderItem order={order} key={order.id} status={"pending"} />
      ))}
    </div>
  );
}

export default OrderList;