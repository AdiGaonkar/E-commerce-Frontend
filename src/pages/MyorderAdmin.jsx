import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { setAdminOrders } from "../store/orderSlice";

const STATUS_OPTIONS = [
  "placed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.adminOrders);

  // Fetch all orders for admin
  const fetchAdminOrders = async () => {
    try {
      const res = await Axios({ ...SummaryApi.adminOrderList });
      if (res.data.success) {
        dispatch(setAdminOrders(res.data.data));
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load admin orders");
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await Axios({
        ...SummaryApi.update_order_status,
        url: SummaryApi.update_order_status.url + "/" + orderId,
        method: "PUT",
        data: { status: newStatus },
      });

      if (res.data.success) {
        toast.success("Order status updated!");
        fetchAdminOrders();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error updating status");
    }
  };

  return (
    <div>
      <div className="bg-white shadow-md p-4 font-semibold text-xl">
        <h1>All Orders (Admin Panel)</h1>
      </div>

      {orders.length === 0 && (
        <p className="text-center text-gray-500 mt-5">No orders found</p>
      )}

      <div className="p-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-5 mb-5 rounded-xl shadow border border-gray-200"
          >
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg text-gray-800">
                  Order No: {order.orderId}
                </p>

                {/* Customer Details */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Customer:</span>{" "}
                  {order.user?.name || "N/A"}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Email:</span>{" "}
                  {order.user?.email || "N/A"}
                </p>

                {/* Address */}
                <div className="mt-3 text-sm text-gray-700">
                  <p className="font-semibold text-gray-800">
                    Delivery Address:
                  </p>

                  {order.delivery_address ? (
                    <>
                      <p>{order.delivery_address.address_line}</p>
                      <p>
                        {order.delivery_address.city},{" "}
                        {order.delivery_address.state}
                      </p>
                      <p>
                        {order.delivery_address.country} -{" "}
                        {order.delivery_address.pincode}
                      </p>
                      <p>
                        <span className="font-semibold">Mobile:</span>{" "}
                        {order.delivery_address.mobile}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">No address found</p>
                  )}
                </div>

                {/* Product Name */}
                <p className="mt-3 text-gray-700 font-medium">
                  Product: {order.product_details?.name}
                </p>
              </div>

              {/* Status Dropdown */}
              <div>
                <select
                  className="border p-2 rounded-md bg-white shadow-sm"
                  value={order.order_status}
                  onChange={(e) =>
                    handleUpdateStatus(order._id, e.target.value)
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replaceAll("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Image */}
            <div className="flex gap-3 mt-4">
              <img
                src={order.product_details?.image?.[0]}
                alt="product"
                className="w-20 h-20 rounded-lg border"
              />
            </div>

            {/* Footer: Amount */}
            <div className="mt-4 text-gray-700">
              <p>
                <span className="font-semibold">Total Amount:</span>{" "}
                ₹{order.totalAmt}
              </p>

              <p className="text-sm text-gray-500">
                Status:{" "}
                <span className="font-semibold">{order.order_status}</span>
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Order Date: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
