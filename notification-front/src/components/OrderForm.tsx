import { type ChangeEvent, type FormEvent, useState } from "react";
import { useOrders } from "../context/useOrders";

function OrderForm() {
  const [order, setOrder] = useState({
    title: "",
    description: "",
    done: false,
    products: [{ name: "", quantity: 1, price: 0 }],
    status: "",
    total: 0,
    user: "",
  });

  const { createOrder } = useOrders();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setOrder({
      ...order,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // Cambiar productos
  const handleProductChange = (
    index: number,
    field: "name" | "quantity" | "price",
    value: string | number
  ) => {
    const newProducts = [...order.products];
    if (field === "name") {
      newProducts[index][field] = String(value);
    } else {
      newProducts[index][field] = Number(value);
    }
    setOrder({ ...order, products: newProducts });
  };

  const addProduct = () => {
    setOrder({
      ...order,
      products: [...order.products, { name: "", quantity: 1, price: 0 }],
    });
  };

  const removeProduct = (index: number) => {
    const newProducts = order.products.filter((_, i) => i !== index);
    setOrder({ ...order, products: newProducts });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Calcular total sumando price * quantity de cada producto
    const total = order.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    await createOrder({ ...order, total });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-lg mx-auto">
    
      <div>
        <label className="block font-semibold mb-1">Status</label>
        <select
          name="status"
          onChange={handleChange}
          value={order.status}
          className="border p-2 w-full"
          required
        >
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="finish">Finish</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Products</label>

        {order.products.map((product, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Name"
              value={product.name}
              onChange={(e) =>
                handleProductChange(index, "name", e.target.value)
              }
              className="border p-2 flex-1"
              required
            />
            <input
              type="number"
              min={1}
              placeholder="Quantity"
              value={product.quantity}
              onChange={(e) =>
                handleProductChange(index, "quantity", Number(e.target.value))
              }
              className="border p-2 w-20"
              required
            />
            <input
              type="number"
              min={0}
              placeholder="Price"
              value={product.price}
              onChange={(e) =>
                handleProductChange(index, "price", Number(e.target.value))
              }
              className="border p-2 w-24"
              step="0.01"
              required
            />
            {order.products.length > 1 && (
              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Product
        </button>
      </div>

      <input
        name="user"
        type="text"
        placeholder="User"
        value={order.user}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <button
        type="submit" className="bg-indigo-500 px-3 block py-2 w-full"
      >
        Save Order
      </button>
    </form>
  );
}

export default OrderForm;
