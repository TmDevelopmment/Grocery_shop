import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home.tsx";
import Products from "./pages/Products.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import FlashDeals from "./pages/FlashDeals.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Addresses from "./pages/Addresses.tsx";
import MyOrders from "./pages/MyOrders.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderTracking from "./pages/OrderTracking.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminProductForm from "./pages/admin/AdminProductForm.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners.tsx";
import DeliveryLogin from "./pages/delivery/DeliveryLogin.tsx";
import DeliveryLayout from "./pages/delivery/DeliveryLayout.tsx";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard.tsx";

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1B3022",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "13px",
          },
        }}
      />
      <Routes>
        {/* Auth pages - No navbar or footer */}
        <Route path="/login" element={<Login />} />
        {/* Main app pages - With navbar and footer */}
        <Route path="/*" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="deals" element={<FlashDeals />} />
          <Route element={<ProtectedRoute />}>
            {/* Protected routes go here */}
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:id" element={<OrderTracking />} />
            <Route path="addresses" element={<Addresses />} />
          </Route>
        </Route>
        {/* Admin pages */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Admin routes go here */}
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
        </Route>

        {/* Delivery Partners pages */}
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/delivery/*" element={<DeliveryLayout />}>
          {/* Delivery partner routes go here */}
          <Route index element={<DeliveryDashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
