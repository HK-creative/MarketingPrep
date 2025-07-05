import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Lazy loading hook for components
export const useLazyLoad = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [elementRef, isVisible] as const;
};

// Debounced search hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Virtual scrolling for large lists
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { visibleItems, handleScroll };
};

// Memoized computation hook
export const useMemoizedComputation = <T, R>(
  computeFn: (data: T) => R,
  data: T,
  dependencies: React.DependencyList = []
): R => {
  return useMemo(() => computeFn(data), [data, ...dependencies]);
};

// Cache hook for expensive operations
export const useCache = <K, V>(maxSize = 100) => {
  const cache = useRef(new Map<K, V>());

  const get = useCallback((key: K): V | undefined => {
    return cache.current.get(key);
  }, []);

  const set = useCallback((key: K, value: V): void => {
    if (cache.current.size >= maxSize) {
      const firstKey = cache.current.keys().next().value;
      if (firstKey !== undefined) {
        cache.current.delete(firstKey);
      }
    }
    cache.current.set(key, value);
  }, [maxSize]);

  const has = useCallback((key: K): boolean => {
    return cache.current.has(key);
  }, []);

  const clear = useCallback((): void => {
    cache.current.clear();
  }, []);

  return { get, set, has, clear };
};

// Image lazy loading with blur-up effect
export const useImageLazyLoad = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [elementRef, isVisible] = useLazyLoad();

  useEffect(() => {
    if (!isVisible) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setIsError(true);
    };
    img.src = src;
  }, [src, isVisible]);

  return {
    elementRef,
    imageSrc,
    isLoaded,
    isError,
    isVisible
  };
};

// Optimized event handler
export const useOptimizedEventHandler = <T extends (...args: any[]) => void>(
  handler: T,
  delay = 16 // ~60fps
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgs = useRef<Parameters<T> | null>(null);

  return useCallback((...args: Parameters<T>) => {
    lastArgs.current = args;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (lastArgs.current) {
        handler(...lastArgs.current);
      }
    }, delay);
  }, [handler, delay]) as T;
};

// Bundle splitting utilities
export const loadComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderStart = useRef<number | undefined>(undefined);
  const renderCount = useRef(0);

  useEffect(() => {
    renderStart.current = performance.now();
    renderCount.current++;
  });

  useEffect(() => {
    if (renderStart.current) {
      const renderTime = performance.now() - renderStart.current;
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
        );
      }
    }
  });

  return {
    renderCount: renderCount.current,
    logPerformance: (operation: string, startTime: number) => {
      const duration = performance.now() - startTime;
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} - ${operation}: ${duration.toFixed(2)}ms`);
      }
    }
  };
};

// Optimized local storage hook with compression
export const useOptimizedLocalStorage = <T>(
  key: string,
  defaultValue: T,
  compress = false
) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const parsed = JSON.parse(item);
      return compress && parsed.compressed 
        ? JSON.parse(atob(parsed.data))
        : parsed;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      
      const serialized = JSON.stringify(valueToStore);
      const shouldCompress = compress && serialized.length > 1000;
      
      const dataToStore = shouldCompress
        ? JSON.stringify({ compressed: true, data: btoa(serialized) })
        : serialized;
        
      localStorage.setItem(key, dataToStore);
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, value, compress]);

  return [value, setStoredValue] as const;
};

// React import for lazy loading
import React from 'react'; 