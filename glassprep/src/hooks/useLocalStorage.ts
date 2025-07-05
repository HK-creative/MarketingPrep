import { useState, useEffect } from 'react';

// Custom hook for LocalStorage state management
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: T) => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window == 'undefined') {
      console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
    }

    try {
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(value));
      // Save state
      setStoredValue(value);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    // Read the initial value
    setStoredValue(readValue());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // This only works for other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
} 