import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Product } from "../types";
import { dummyProducts } from "../assets/assets";
import { HomeIcon, Search } from "lucide-react";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import api from "../configs/api";
import { toast } from "react-hot-toast/headless";

const SearchResults = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams("");
  const query = searchParams.get("q") || "";

  const clearSearch = () => {
    setSearchParams("");
    api.get("/products")
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.message || error.message);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    api.get(`/products?search=${encodeURIComponent(query)}`)
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.message || error.message);
      })
      .finally(() => setLoading(false));
  }, [query]);
  

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link to="/" className="text-app-green hover:underline">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium">Search Results</span>
        </nav>
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-app-green">
            Search Results for "{query}"
          </h1>
          <p className="text-sm text-app-text-light mt-1">
            {products.length} {products.length === 1 ? "result" : "results"} found
          </p>
          </div>
          <div>
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-lg"
            >
              Clear Search
            </button>
          </div>
        </div>

        {loading ? (
          <Loading/>
        ) : products.length === 0 ? (
          <div className="flex items-center flex-col gap-4 mt-20">
            <Search className="size-12 text-app-border mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-app-border text-center">
              No products found
            </h2>
            <p className="text-sm text-app-text-light mt-1 text-center">
              We couldn't find any products matching "{query}" Try adjusting your search or browse our products
            </p>
            <Link
              to="/products"
              className="inline-flex px-5 py-2.5 bg-app-green text-white text-sm font-medium rounded-lg"
              >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
