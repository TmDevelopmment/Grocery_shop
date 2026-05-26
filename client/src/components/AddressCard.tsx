import { CheckIcon, MapPinIcon } from "lucide-react";
import type { Address } from "../types";

interface AddressCardProps {
    addr: Address;
    onEditHandler: (addr: Address) => void;
    setAddresses: (addresses: Address[]) => void;
}

const AddressCard = ({addr, onEditHandler, setAddresses} : AddressCardProps) => {
    
    const handleDelete = () => {
        console.log("Delete address with id:", addr._id);
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
    </div>
  )
}

export default AddressCard