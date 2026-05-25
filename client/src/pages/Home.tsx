import Hero from "../components/home/Hero"
import Features from "../components/home/Features"
import HomeCategories from "../components/home/HomeCategories"
import PopularProducts from "../components/home/PopularProducts"
import AddPromoBanner from "../components/home/AddPromoBanner"
import Newsletter from "../components/home/Newsletter"
import CartSidebar from "../components/CartSidebar"


const Home = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Hero/>
      <Features/>
      <HomeCategories/>
      <PopularProducts/>
      <AddPromoBanner/>
      <Newsletter/>
      <CartSidebar/>
    </div>
  )
}

export default Home