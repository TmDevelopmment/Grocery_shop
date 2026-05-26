import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { dummyAddressData } from "../assets/assets";
import { useState } from "react";
import type { Address } from "../types";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  MapPinIcon,
} from "lucide-react";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";

const Checkout = () => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const { items, cartTotal } = useCart();
  const { user } = { user: { address: dummyAddressData } };

  const [step, setStep] = useState("address");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | null>({
    _id: "",
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
    lat: 0,
    lng: 0,
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const deliveryFee = cartTotal > 20 ? 0 : 1.99;
  const tax = cartTotal * 0.07; // 7% tax
  const total = cartTotal + deliveryFee + tax;

  const steps: { key: string; label: string; icon: typeof MapPinIcon }[] = [
    { key: "address", label: "Delivery Address", icon: MapPinIcon },
    { key: "payment", label: "Payment Method", icon: CreditCardIcon },
    { key: "review", label: "Review Order", icon: CheckIcon },
  ];

  const handlePlaceOrder = () => {
    setLoading(true);
    navigate("/orders");
  };

  // Populate addresses from user data on mount
  useState(() => {
    if (user?.address?.length) {
      const defaultAddr =
        user.address.find((addr) => addr.isDefault) || user.address[0];
      setAddress({
        _id: defaultAddr._id,
        label: defaultAddr.label,
        address: defaultAddr.address,
        city: defaultAddr.city,
        state: defaultAddr.state,
        zip: defaultAddr.zip,
        isDefault: defaultAddr.isDefault,
        lat: defaultAddr.lat,
        lng: defaultAddr.lng,
      });
    }
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-cream">
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p>Add some products to checkout</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 px-4 py-2 bg-app-green text-white rounded-lg hover:bg-app-green-light transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </button>
        <h1 className="text-2xl font-semibold text-app-green mb-8">Checkout</h1>

        {/* step indicator */}
        <div className="flex items-center gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${step === s.key ? "bg-app-green text-white" : "bg-white text-app-text-light"}`}
              >
                <s.icon className="size-4" /> {s.label}
                {i < steps.length - 1 && (
                  <ChevronRightIcon className="size-4 text-app-text-light" />
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="md:col-span-2 space-y-6">
            {step === "address" && (
              <CheckoutAddress
                user={user}
                address={address}
                setAddress={setAddress}
                setStep={setStep}
              />
            )}

            {step === "payment" && (
              <CheckoutPayment
                setStep={setStep}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            )}

            {step === "review" && (
              <CheckoutReview
                address={address}
                items={items}
                handlePlaceOrder={handlePlaceOrder}
                loading={loading}
                total={total}
              />
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="text-sm font-semibold text-app-green mb-5">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm border-t border-app-border pt-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span>
                  {currency}
                  {cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0
                    ? <span className="text-app-success">Free</span>
                    : `${currency}${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>
                  {currency}
                  {tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-app-border text-base font-semibold text-app-green">
                <span>Total</span>
                <span>
                  {currency}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
