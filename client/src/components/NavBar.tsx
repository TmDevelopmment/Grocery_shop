import {
    ArrowRightIcon,
  BikeIcon,
  ChevronDownIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const NavBar = () => {
  const user: any = {
    name: "John Doe",
    email: "johndoe@example.com",
    isAdmin: true,
  };

  const { cartCount, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
    }
  }

  const handleLogout = () => {
    setUserMenuOpen(false);
    navigate("/");
  }

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-[22px] font-medium shrink-0"
        >
          <BikeIcon size={24} /> Instacart
        </Link>

        <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/deals" className="text-app-orange">
              Deals
            </Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <form className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm" onSubmit={handleSearch}>
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
              <input
                type="text"
                placeholder="Search for products"
                className="pl-10 pr-4 py-2 border border-app-border rounded-full focus:outline-none focus:ring-2 focus:ring-app-orange/30 focus:border-transparent bg-orange-300/15 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
              />
            </div>
          </form>
          <div className="flex items-center gap-4">
            {/* cart */}
            <button
              className="relative p-2 rounded-xl"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon className="size-5 text-zinc-900" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-app-orange text-white text-[10px] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="relative">
              {user ? (
                <button
                  className="flex items-center gap-2 p-2"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-app-orange text-white flex-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDownIcon
                    className={`size-4 text-zinc-700 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <div className="flex-center gap-2">
                  <Link
                    to="/login"
                    className="hidden md:flex items-center gap-1 text-sm text-zinc-700 hover:text-app-orange"
                  >
                    <UserIcon size={16} className="text-zinc-700" />
                    Sign In
                  </Link>
                  {userMenuOpen ? (
                    <XIcon
                      className="md:hidden"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    />
                  ) : (
                    <MenuIcon
                      className="md:hidden"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    />
                  )}
                </div>
              )}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-app-border rounded-md shadow-lg py-1 z-10">
                  {user && (
                    <div className="px-4 py-2 border-b border-app-border">
                      <p className="text-sm font-medium text-zinc-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  )}
                  <div onClick={() => setUserMenuOpen(false)}>
                    {!user && <Link to="/login" className="dropdown-link"><UserIcon size={16}/>Sign In</Link>}
                    {user && <Link to="/orders" className="dropdown-link"><PackageIcon size={16}/>My Orders</Link>}
                    {user && <Link to="/address" className="dropdown-link"><MapPinIcon size={16}/>Address</Link>}
                    {<Link to="/products" className="dropdown-link mg:hidden"><ArrowRightIcon size={16}/>My Products</Link>}
                    {<Link to="/deals" className="dropdown-link md:hidden"><ArrowRightIcon size={16}/>My Deals</Link>}
                    {user?.isAdmin && (
                        <Link to="/admin/products" className="dropdown-link">
                            <ShieldIcon size={16} className="text-app-orange"/><span>Admin Panel</span></Link>
                    )}
                    {user && (
                        <div className="border-t border-app-border pt-1">
                            <button className="flex items-center gap-2 text-sm text-zinc-700 hover:text-app-orange w-full text-left px-4 py-2" onClick={handleLogout}>
                                <LogOutIcon size={16} className="text-zinc-700"/><span>Logout</span>
                            </button>
                        </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
