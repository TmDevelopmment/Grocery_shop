import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  StarIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";
import { dummyProducts } from "../assets/assets";
import DummyReviewsSection from "../assets/DummyReviewsSection";
import ProductCard from "../components/ProductCard";
import api from "../configs/api";
import toast from "react-hot-toast";

const ProductPage = () => {
  const currency = import.meta.env.VITE_APP_CURRENCY_SYMBOL || "Rs";
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localQuantity, setLocalQuantity] = useState(1);

  useEffect(() => {
    // Fetch product details using the id from params
    setLoading(true);
    setLocalQuantity(1);
    window.scrollTo(0, 0);

    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.product);
      return api.get(`/products?category=${data.product.category}`);
    }).then(({ data }) => {
      setRelatedProducts(data.products.filter((p: Product) => p.id !== id));
    }).catch((error) => {
      console.error("Failed to fetch product details:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to load product details");
    }).finally(() => setLoading(false));

  }, [id, navigate]);

  if (loading) {
    return <Loading />;
  }

  if (!product) return null;

  const cartItem = items.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;
  const displayQuantity = inCart ? cartItem.quantity : localQuantity;

  const handleMinus = () => {
    if (inCart) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, cartItem.quantity - 1);
      } else {
        removeFromCart(product.id);
      }
    } else {
      setLocalQuantity(Math.max(1, localQuantity - 1));
    }
  };

  const handlePlus = () => {
    if (inCart) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      setLocalQuantity(localQuantity + 1);
    }
  };

  const categoryLabel = product.category.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs / Category / {categoryLabel} */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link to="/" className="hover:text-app-green transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-app-green transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-app-green transition-colors capitalize"
          >
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium truncate max-w-50">
            {product.name}
          </span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-app-text-light hover:text-app-green transition-colors mb-6"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </button>

        {/* Product Details */}
        <div className="bg-white/50 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: Image */}
            <div className="relative flex-center p-8 md:p-12 min-h-80 md:min-h-120">
              <img
                src={product.image}
                alt={product.name}
                className="object-contain max-h-90 w-auto"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                {product.isOrganic && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-app-green text-white rounded-full">
                    <LeafIcon className="w-3 h-3" />
                    Organic
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-app-orange text-white rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="p-6 md:p-12 flex flex-col justify-center">
              <span className="text-xs font-medium text-app-text-light tracking-wider mb-2 capitalize">
                {categoryLabel}
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold text-app-green mb-3">
                {product.name}
              </h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-1 mb-4">
                  <span className="text-sm font-medium text-app-green">
                    {product.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating)
                            ? "text-app-warning fill-app-warning"
                            : "text-app-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-app-text-light">
                    {product.rating}
                  </span>
                  <span className="text-sm font-medium text-app-text-light">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl md:text-4xl font-semibold text-app-green">
                  {currency}
                  {product.price.toFixed(2)}
                </span>

                {product.originalPrice > product.price && (
                  <span className="text-xl text-app-text-light line-through ml-2">
                    {currency}
                    {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {/* Description */}
              <p className="text-app-text-light text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Stock */}
              <div>
                {product.stock > 0 ? (
                  <span className="text-app-success font-medium text-sm">
                    In Stock ({product.stock} Available)
                  </span>
                ) : (
                  <span className="text-app-error font-medium text-sm">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center border border-app-border rounded-xl overflow-hidden">
                  <button
                    onClick={handleMinus}
                    className="p-3 hover:bg-app-cream transition-colors"
                  >
                    <MinusIcon className="size-4" />
                  </button>
                  <span className="px-4 text-sm font-semibold text-app-green min-w-10">
                    {displayQuantity}
                  </span>
                  <button
                    onClick={handlePlus}
                    className="p-3 hover:bg-app-cream transition-colors"
                  >
                    <PlusIcon className="size-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (!inCart) {
                      addToCart(product, localQuantity);
                    }
                  }}
                  className={`flex justify-center items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors w-60 ${inCart ? "bg-app-green text-white cursor-not-allowed" : "bg-app-orange text-white hover:bg-app-orange-dark"}`}
                  disabled={product.stock === 0}
                >
                  <ShoppingCartIcon className="size-4" />
                  {inCart ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        {product.reviewCount > 0 && <DummyReviewsSection product={product} />}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 mb-44">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-app-text-light mb-2">
                  Related Products
                </h2>
                <p className="text-sm text-app-text-light">
                  More from {categoryLabel} category that you might like.
                </p>
              </div>
              <Link
                to={`/products?category=${product.category}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-app-green hover:text-app-green-dark transition-colors mt-4"
              >
                View All <ArrowRightIcon className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-8">
              {relatedProducts.slice(0, 5).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
