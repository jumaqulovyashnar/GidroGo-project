export const Spinner = ({
    size = "md",
    className = "",
    ...props
}) => {
    const sizeClasses = {
        xs: "size-4 border-2",
        sm: "size-5 border-2",
        md: "size-7 border-[3px]",
        lg: "size-9 border-[3.5px]",
        xl: "size-12 border-4",
    }

    const currentSize = sizeClasses[size] || sizeClasses.md

    return (
        <div
            role="status"
            aria-label="Yuklanmoqda..."
            className={`inline-block rounded-full border-blue-100 border-t-[#2563EB] animate-spin shrink-0 ${currentSize} ${className}`}
            {...props}
        />
    )
}

export default Spinner