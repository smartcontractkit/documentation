import { useState, useCallback } from "react"

/**
 * Custom hook for localStorage operations with type safety and SSR support
 * Provides a React-friendly interface for localStorage with automatic serialization
 */

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state with SSR-safe approach
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SSR Guard: Return initial value during server-side rendering
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage and state
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function for functional updates
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        // SSR Guard: Only update localStorage in browser
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)

      // SSR Guard: Only update localStorage in browser
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Simplified hook for setting localStorage values without state management
 * Useful for fire-and-forget localStorage operations
 */
export function useLocalStorageSet() {
  const setItem = useCallback(<T>(key: string, value: T) => {
    // SSR Guard: Only update localStorage in browser
    if (typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [])

  const removeItem = useCallback((key: string) => {
    // SSR Guard: Only update localStorage in browser
    if (typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [])

  return { setItem, removeItem }
}

/**
 * Hook for wallet connection state management
 * Provides typed interface for wallet-specific localStorage operations
 */
interface WalletConnectionState {
  isWalletConnected: boolean
  userAddress: string
  currentChainId?: string
}

export function useWalletConnectionStorage() {
  const [connectionState, setConnectionState, clearConnectionState] = useLocalStorage<WalletConnectionState | null>(
    "isWalletConnected",
    null
  )

  const saveConnectionState = useCallback(
    (userAddress: string, currentChainId?: string) => {
      setConnectionState({
        isWalletConnected: true,
        userAddress,
        currentChainId,
      })
    },
    [setConnectionState]
  )

  const clearConnection = useCallback(() => {
    clearConnectionState()
  }, [clearConnectionState])

  return {
    connectionState,
    saveConnectionState,
    clearConnection,
    isConnected: connectionState?.isWalletConnected ?? false,
    userAddress: connectionState?.userAddress ?? "",
    currentChainId: connectionState?.currentChainId,
  }
}

/**
 * Hook for network change pending state
 * Manages the temporary state during network switching
 */
export function useNetworkChangeStorage() {
  const { setItem } = useLocalStorageSet()

  const setNetworkChangePending = useCallback(
    (isPending: boolean) => {
      setItem("isNetworkChangePending", isPending.toString())
    },
    [setItem]
  )

  return { setNetworkChangePending }
}
