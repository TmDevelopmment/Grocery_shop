import { Loader2Icon } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex-center min-h-96 h-full w-full">
        <Loader2Icon className="animate-spin size-8 text-app-green mx-auto" />
    </div>
  )
}

export default Loading