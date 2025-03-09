import { useEffect, useRef } from 'react';

export function useDebounce(callback, delay) {
  const debouncedCallback = useRef(null);

  useEffect(() => {
    debouncedCallback.current = debounceFn(callback, delay);
  }, [callback, delay]);

  return debouncedCallback.current;
}

export function debounceFn(func: any, delay: number = 500) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
