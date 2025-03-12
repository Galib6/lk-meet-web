import { useEffect, useState } from 'react';

export interface ILocalStorageEvent extends Event {
  key: string;
  value: any;
}

type LocalStorageValue<T> = T | null;

type Config<T> = {
  key: string;
  initialValue: T;
};
const useLocalStorage = <T = any>(
  config: Config<T>,
): [LocalStorageValue<T>, (value: T | ((val: LocalStorageValue<T>) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<LocalStorageValue<T>>(config.initialValue);

  // Update the localStorage whenever the state changes
  const setValue = (value: T | ((val: LocalStorageValue<T>) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save to localStorage
      localStorage.setItem(config.key, JSON.stringify(valueToStore));

      const event = new Event('onChangeLocalStorage') as ILocalStorageEvent;
      event.key = config.key;
      event.value = valueToStore;
      window.dispatchEvent(event);
    } catch (error) {
      console.error(error);
    }
  };

  const getValue = (): T => {
    if (typeof window === 'undefined') {
      return config.initialValue;
    }
    try {
      const item = localStorage.getItem(config.key);
      return item ? JSON.parse(item) : config.initialValue;
    } catch (error) {
      console.error(error);
      return config.initialValue;
    }
  };

  // Update the state when localStorage changes
  useEffect(() => {
    setStoredValue(getValue()); // Use to load the value from localStorage on the client side

    const handleChange = (e: ILocalStorageEvent) => {
      if (e.key !== config.key || e.type !== 'onChangeLocalStorage') return;
      setStoredValue(e.value);
    };

    window.addEventListener('onChangeLocalStorage', handleChange);
    return () => {
      window.removeEventListener('onChangeLocalStorage', handleChange);
    };
  }, []);

  // Clear the localStorage
  const clear = () => {
    setValue(null);
    localStorage.removeItem(config.key);
  };

  return [storedValue, setValue, clear];
};

export default useLocalStorage;
