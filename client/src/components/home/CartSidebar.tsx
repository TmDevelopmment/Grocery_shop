import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { MinusIcon, PlusIcon, ShoppingBagIcon, ShoppingCartIcon, Trash2,XIcon } from "lucide-react";

const CartSidebar = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const deliveryFee = cartTotal > 20 ? 0 : 1.99; // Free delivery for orders over $20
  const grandTotal = cartTotal + deliveryFee;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-50 h-full w-full bg-black/40 shadow-lg p-6 transition-opacity"
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* header */}
        <div className="flex items-center justify-between p-5 border-b border-app-border">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="size-5" />
            <h2 className="text-lg font-medium">Your cart</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-app-cream rounded-full">
              {items.length} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl hover:bg-app-cream transition-colors"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <ShoppingBagIcon className="size-16 text-app-border mb-4" />
              <p className="text-lg font-medium mb-1 text-app-gray">Your cart is empty</p>
              <p className="text-sm text-app-text-light">Start shopping to add items to your cart</p>
            </div>
            ) : (
              items.map((item) => (
                <div key={item.product._id} className="flex gap-3 bg-app-cream/60 rounded-xl p-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="size-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{item.product.name}</h3>
                    <p className="text-xs text-app-text-light">${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <button className="size-7 rounded-lg bg-white border border-app-border flex-center" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                          <MinusIcon className="size-3" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button className="size-7 rounded-lg bg-white border border-app-border flex-center" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                          <PlusIcon className="size-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {currency}{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button className="p-1 text-app-text-light hover:text-app-error transition-colors" onClick={() => removeFromCart(item.product._id)}>
                          <Trash2 className="size-4"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-app-border space-y-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-app-text-light">Subtotal</span>
              <span className="text-sm font-medium">{currency}{cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-sm text-app-text-light">Delivery Fee</span>
              <span className={`text-sm font-medium ${deliveryFee === 0 ? "text-green-600" : ""}`}>
                {deliveryFee === 0 ? "Free" : `${currency}${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            {deliveryFee > 0 && <p className="text-xs text-app-text-light">Free delivery on orders above {currency} 20!</p>}

            <div className="flex justify-between mb-4 border-t border-app-border pt-3">
              <span className="text-base font-semibold">Total</span>
              <span className="text-base font-semibold">{currency}{grandTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate("/checkout");
                window.scrollTo(0, 0);
              }}
              className="w-full py-3 bg-app-green text-white font-medium rounded-lg hover:bg-app-green-dark transition-colors"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full py-3 mt-2 bg-app-error text-white font-medium rounded-lg hover:bg-app-error-dark transition-colors"
            >
              Clear Cart
            </button>

          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
