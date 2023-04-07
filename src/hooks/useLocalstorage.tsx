import { useState, useEffect } from "react";

export default function useLocalStorage<T = string>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Get the stored value from local storage or set it to the initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Update the stored value in local storage when it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
