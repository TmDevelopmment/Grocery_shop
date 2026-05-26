import { useEffect, useState } from "react";
import type { Address } from "../types";
import { dummyAddressData } from "../assets/assets";
import { MapPinIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Loading from "../components/Loading";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";

const Addresses = () => {
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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    resetForm();
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((addr) => addr._id !== id));
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
    setEditingId(add._id);
    setShowForm(true);
  };

  useEffect(() => {
    setAddresses(dummyAddressData);
    setTimeout(() => setLoading(false), 1000); // Simulate loading delay
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
                key={add._id}
                addr={add}
                onEditHandler={onEditHandler}
                setAddresses={setAddresses}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          className="px-2 py-1 bg-app-green text-white text-xs font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-1"
          onClick={() => onEditHandler(addresses[0])}
        >
          <PencilIcon className="size-4" />
        </button>

        <button
          onClick={() => handleDelete(addresses._id)}
          className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center gap-1"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default Addresses;
