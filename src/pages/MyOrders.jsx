import React from "react";
import { useSelector } from "react-redux";
import NoData from "../components/NoData";

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order);

  if (!orders.length) return <NoData />;

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>Your Orders</h1>
      </div>

      {orders.map((order) => (
        <div key={order._id} className="bg-white p-4 my-4 rounded shadow">
          <p>Order No: {order.orderId}</p>

          <div className="flex gap-3 mt-2">
            <img
              src={order.product_details.image[0]}
              className="w-14 h-14"
            />
            <p className="font-medium">{order.product_details.name}</p>
          </div>

          <p className="mt-3 text-sm font-semibold">
            Status: {order.order_status.toUpperCase()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
