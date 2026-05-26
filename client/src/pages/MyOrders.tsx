import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Order } from "../types";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";
import { CalendarIcon, ChevronRightIcon, PackageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../configs/api";

const MyOrders = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "Rs";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParam, setSearchParam] = useSearchParams();

  const tabs = ["all", "Placed", "Out for Delivery", "Delivered", "Cancelled"];

  const { clearCart } = useCart();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = activeTab !== "all" ? `?status=${activeTab}` : "";
      const { data } = await api.get(`/orders${params}`);
      setOrders(data.orders);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParam.get("clearCart")) {
      clearCart();
      setSearchParam({});
      setTimeout(() => {
        fetchOrders();
      }, 1000);
    } else {
      fetchOrders();
    }
    setLoading(false);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-app-cream mb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-app-green mb-6">
          My Orders
        </h1>

        {/* Tabs: */}
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 ${activeTab === tab ? "bg-app-green text-white" : "bg-white text-app-text-light hover:bg-app-cream"}`}
            >
              {tab === "all" ? "All Orders" : tab}
            </button>
          ))}
        </div>

        {/* Orders List: */}
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <PackageIcon className="size-16 text-app-border mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-app-text-light">
              No orders found
            </h2>
            <p className="text-app-text-light">
              You have not placed any orders yet.
            </p>
            <Link
              to="/products"
              className="inline-block mt-4 px-4 py-2 bg-app-green text-white rounded-xl hover:bg-app-green-dark transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
              >
                {/* order id, date & status: */}
                <div className="flex items-center justify-between">
                  {/* left */}
                  <div>
                    <p className="text-sm text-app-green font-medium">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="size-3 text-app-text-light" />
                      <span className="text-app-text-light text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  {/* right */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${order.status === "Placed" ? "bg-yellow-100 text-yellow-800" : order.status === "Out for Delivery" ? "bg-blue-100 text-blue-800" : order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {order.status}
                    </span>
                    <ChevronRightIcon className="size-4 text-app-text-light" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  {order.items.slice(0, 4).map((product) => (
                    <img
                      key={product.id}
                      src={product.image}
                      alt={product.name}
                      className="size-12 sm:size-14 rounded-lg object-cover border border-app-border"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className="size-12 sm:size-14 rounded-lg border border-app-border flex items-center justify-center text-sm text-app-text-light">
                      +{order.items.length - 4} more
                    </div>
                  )}
                </div>

                {/* total items & price: */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-app-text-light">
                    {order.items.length} {order.items.length > 1 ? "items" : "item"}
                  </p>
                  <p className="text-sm font-medium text-app-green">
                    Total: {currency} {order.total.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
