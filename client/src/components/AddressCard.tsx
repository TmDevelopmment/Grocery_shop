import { CheckIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { Address } from "../types";

interface AddressCardProps {
    addr: Address;
    onEditHandler: (addr: Address) => void;
    setAddresses: (addresses: Address[]) => void;
}

const AddressCard = ({addr, onEditHandler, setAddresses} : AddressCardProps) => {
    
    const handleDelete = () => {
        setAddresses((prev) => prev.filter((a) => a._id !== addr._id));
    }

  return (
    <div key={addr._id} className="max-w-3xl bg-white rounded-2xl p-6 flex items-start justify-between shadow">
        <div className="flex gap-4">
            <div className="size-10 rounded-xl bg-app-cream flex-center shrink-0">
                <MapPinIcon className="size-5 text-app-green" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-4 mb-1">
                    <p className="text-sm font-semibold text-app-green">{addr.label}</p>
                    {addr.isDefault && <span className="text-xs text-app-green bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckIcon className="size-3 inline-block mr-1" /> Default
                        </span>}
                </div>
                <p className="text-sm text-app-text-light">
                    {addr.address}, {addr.city}, {addr.state} {addr.zip}
                </p>
            </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
            <button
                onClick={() => onEditHandler(addr)}
                className="px-2 py-1 text-green text-xs font-semibold rounded-xl hover:text-app-green-light transition-colors flex items-center gap-1"
                aria-label="Edit address"
            >
                <PencilIcon className="size-4" />
            </button>

            <button
                onClick={handleDelete}
                className="px-2 py-1 text-black text-xs font-semibold rounded-xl hover:text-app-error transition-colors flex items-center gap-1"
                aria-label="Delete address"
            >
                <Trash2Icon className="size-4" />
            </button>
        </div>
    </div>
  )
}

export default AddressCard