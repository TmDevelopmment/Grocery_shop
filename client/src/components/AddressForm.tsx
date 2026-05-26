import { XIcon } from "lucide-react";

const AddressForm = ({
  resetForm,
  handleSubmit,
  formData,
  setFormData,
  editingId,
}: any) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" />

      <div onClick={resetForm} className="fixed inset-0 z-50 flex-center">
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg aniimate-fade-in"
        >
          <div>
            <h2 className="text-lg font-semibold text-app-green">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              type="button"
              className="p-2 hover:bg-app-cream rounded-lg"
              onClick={resetForm}
            >
              <XIcon className="size-5" />
            </button>
          </div>

          {/* form input fields here */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-app-green focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-app-green focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-app-green focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-app-green focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) =>
                  setFormData({ ...formData, zip: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-app-green focus:outline-none"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="h-4 w-4 text-app-green focus:ring-app-green border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Set as default
              </label>
            </div>
          </div>

          {/* submit button */}
          <button
            type="submit"
            className="mt-6 w-full bg-app-green text-white py-2 rounded-lg hover:bg-app-green-light transition-colors"
          >
            {editingId ? "Update Address" : "Add Address"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddressForm;
