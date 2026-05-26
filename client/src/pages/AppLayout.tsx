import { Outlet } from "react-router-dom"
import Banner from "../components/Banner"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import CartSidebar from "../components/CartSidebar"

const AppLayout = () => {
  return (
    <>
    <Banner/>
    <NavBar/>
    <main className='min-h-screen]:'>
      <Outlet />
    </main>
    <Footer/>
    <CartSidebar />
    </>
  )
}

export default AppLayout