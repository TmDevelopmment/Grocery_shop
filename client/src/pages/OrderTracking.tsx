import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Order } from "../types";
import { dummyDashboardOrdersData } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowLeftIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import OrderOTP from "../components/OrderTracking/OrderOTP";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";

const OrderTracking = () => {

  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    setOrder(dummyDashboardOrdersData.find((order) => order.id === id) as any);
    setLoading(false);
  }, [id, navigate]);

  if (loading) return <Loading />;
  if (!order) return null;

  return (
    <div className="min-h-screen mb-20 bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <button
          className="flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeftIcon className="size-4" /> Back to Orders
        </button>

        {/* Order id, date, status */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-app-green">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-app-text-light mt-1">
              Placed on{" "}
              {new Date(order!.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered" ? "bg-green-100 text-green-800" : order.status === "shipped" ? "bg-blue-100 text-blue-800" : order.status === "processing" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
          >
            {order.status === "delivered"
              ? "Delivered"
              : order.status === "shipped"
                ? "Shipped"
                : order.status === "processing"
                  ? "Processing"
                  : "Pending"}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left side - map */}
          <div className="lg:col-span-2 space-y-6">
            <OrderOTP order={order} />
            {/* Live Location */}
            <LiveMap order={order} liveLocation={liveLocation} />
            {/* Progress Timeline */}
            <OrderTimeLine order={order} />

            {/* Delivery Partner: John Doe (555-123-4567) */}
            {order.deliveryPartner && order.status !== "delivered" && order.status !== "cancelled" && (
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-app-green text-white flex-center">
                    <span className="text-sm font-semibold">{order.deliveryPartner.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-app-green">{order.deliveryPartner.name}</p>
                    <p className="text-xs text-app-text-light capitalize">{order.deliveryPartner.vehicleType} </p>
                  </div>
                </div>
                <a href={`tel:${order.deliveryPartner.phone}`} className="mt-4 inline-flex items-center text-sm text-app-green hover:underline">
                  <PhoneIcon className="size-4 inline-block mr-1" /> {order.deliveryPartner.phone}
                </a>
              </div>
            )}
          </div>

          {/* Right side - order details */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6">
              <h3>
                <MapPinIcon className="size-4" /> Delivery Address
              </h3>
              <p className="text-sm text-app-text-light mt-2 leading-relaxed">
                {order?.shippingAddress.label}
                <br/>
                {order?.shippingAddress.address}
                <br/>
                {order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.zip}
              </p>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-app-green mb-3">Items ({order.items.length})</h3>
            </div>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="size-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-app-green truncate">{item.name}</p>
                    <p className="text-xs text-app-text-light">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-app-green">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between text-sm text-app-text-light">
                <span>Subtotal</span>
                <span>{currency}{order?.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-app-text-light">
                <span>Delivery Charge</span>
                <span>{currency}{order?.deliveryFee === 0 ? "Free" : `${currency}${order?.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-app-text-light">
                <span>Tax</span>
                <span>{currency}{order?.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-app-green">
                <span>Total</span>
                <span>{currency}{order?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
