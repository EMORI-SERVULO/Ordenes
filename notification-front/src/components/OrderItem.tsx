import { useOrders } from "../context/useOrders";
import { type Order } from "../interface/order.interface";
import { IoCheckmarkDone, IoTrash } from "react-icons/io5";
type Status = "pending" | "created" | "finish";
interface Props {
  order: Order;
  status: Status
}

function OrderItem({ order }: Props) {
  const { deleteOrder, updateOrder } = useOrders();
  
const statusColors: Record<string, string> = {
  pending: "text-yellow-500",
  created: "text-green-500",
  finish: "text-blue-500",
};
  return (
    <div className="bg-gray-900 p-2 my-2 flex justify-between hover:bg-gray-800 hover:cursor-pointer">
  <div className="flex items-center w-full p-4 border-b text-sm space-x-4">
    <div className="w-1/12 font-bold">{order.id}</div>

    <div className="w-1/6">
      <button className={`${statusColors[order.status] || "text-slate-400"}`}>
        {order.status}
      </button>
    </div>

    <div className="w-1/6 font-bold">
      {order.date
        ? new Date(order.date).toLocaleDateString()
        : "No hay fecha"}
    </div>

    <div className="flex-1 font-bold">
      <ul className="list-disc list-inside max-h-24 overflow-auto">
        {order.products.map((product, index) => (
          <li key={index}>
            {product.name} — ${product.price} × {product.quantity}
          </li>
        ))}
      </ul>
    </div>
  </div>


      <div className="flex gap-x-2">
        <button
          onClick={() => {
            if (!window.confirm("Are you sure you want to delete it?")) return;
            deleteOrder(order.id);
          }}
        >
          <IoTrash className="hover:text-red-500" />
        </button>
        <button onClick={() => updateOrder(order.id, { done: !order.done })}>
          {order.done ? (
            <IoCheckmarkDone className="hover:text-green-500" />
          ) : (
            <IoCheckmarkDone className="text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}

export default OrderItem;