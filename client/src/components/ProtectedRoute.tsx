import Addresses from "../pages/Addresses"
import MyOrders from "../pages/MyOrders"

const ProtectedRoute = () => {
  return (
      <div>
        <MyOrders />
      <Addresses />
      </div>
  )
}

export default ProtectedRoute