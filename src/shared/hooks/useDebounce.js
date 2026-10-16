import { useState, useEffect } from "react"

/**
 * Reusable debounce hook for search queries, form inputs, and window events
 * Prevents excessive state updates and unnecessary backend API calls
 * @param {any} value - value to debounce
 * @param {number} [delay=350] - debounce delay in ms
 * @returns {any} debounced value
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
