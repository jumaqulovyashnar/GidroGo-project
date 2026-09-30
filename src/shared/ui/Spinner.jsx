import { Loader2 } from "lucide-react"

export const Spinner = ({ className = "size-8 text-blue-600 animate-spin", ...props }) => {
    return (
        <div className="flex items-center justify-center" role="status" {...props}>
            <Loader2 className={className} />
            <span className="sr-only">Yuklanmoqda...</span>
        </div>
    )
}

export default Spinner