import { useEffect, useState } from "react";
import type { Address } from "../types";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Loading from "../components/Loading";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../configs/api";

const Addresses = () => {

  const { updateUser } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  const resetForm = () => {
    setFormData({
      label: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });
    setShowForm(false);
    setEditingId(null);
  };


  const getLocation = (retries = 3) : Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }
      const attempt = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error: any) => {
            if (retries > 0) {
              retries--;
              setTimeout(attempt, 1000); // Retry after 1 second
            } else {
              reject(new Error("Unable to retrieve your location"));
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
          }
        );
      };
      attempt();
    });
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const coords = await getLocation();
      const payload = {...formData, ...coords};

      if (editingId) {
        const { data } = await api.put(`/addresses/${editingId}`, payload);
        setAddresses(data);
        setShowForm(false);
        updateUser({ addresses: data.addresses });
        toast.success("Address updated successfully");
      } else {
        const { data } = await api.post("/addresses", payload);
        setAddresses(data);
        setShowForm(false);
        updateUser({ addresses: data.addresses });
        toast.success("Address added successfully");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  const onEditHandler = (add: Address) => {
    setFormData({
      label: add.label,
      address: add.address,
      city: add.city,
      state: add.state,
      zip: add.zip,
      isDefault: add.isDefault,
    });
    setEditingId(add.id);
    setShowForm(true);
  };

  useEffect(() => {
    api.get("/addresses")
      .then(({ data }) => {
        setAddresses(data);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || error.message);
      }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto  py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            My Addresses
          </h1>
          <button
            className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <PlusIcon className="size-4" /> Add Address
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <AddressForm
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            editingId={editingId}
          />
        )}

        {/* Address List */}
        {loading ? (
          <Loading />
        ) : addresses.length === 0 ? (
          <div className="text-center py-20">
            <MapPinIcon className="size-12 text-app-border mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-app-border">
              No addresses saved
            </h2>
            <p className="text-sm text-app-text-light">
              Add address for faster checkout
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((add) => (
              <AddressCard
                key={add.id}
                addr={add}
                onEditHandler={onEditHandler}
                setAddresses={setAddresses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
