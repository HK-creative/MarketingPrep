import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  items: HTMLElement[];
  onEscape?: () => void;
  onEnter?: (index: number) => void;
  loop?: boolean;
  autoFocus?: boolean;
}

export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  options: UseKeyboardNavigationOptions
) => {
  const currentIndexRef = useRef(0);
  const { items, onEscape, onEnter, loop = true, autoFocus = false } = options;

  const focusItem = useCallback((index: number) => {
    if (items[index]) {
      items[index].focus();
      currentIndexRef.current = index;
    }
  }, [items]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = currentIndexRef.current + 1;
        if (nextIndex < items.length) {
          focusItem(nextIndex);
        } else if (loop) {
          focusItem(0);
        }
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = currentIndexRef.current - 1;
        if (prevIndex >= 0) {
          focusItem(prevIndex);
        } else if (loop) {
          focusItem(items.length - 1);
        }
        break;

      case 'Home':
        event.preventDefault();
        focusItem(0);
        break;

      case 'End':
        event.preventDefault();
        focusItem(items.length - 1);
        break;

      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        onEnter?.(currentIndexRef.current);
        break;
    }
  }, [items, focusItem, loop, onEscape, onEnter]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Auto-focus first item if enabled
    if (autoFocus && items.length > 0) {
      focusItem(0);
    }

    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, handleKeyDown, autoFocus, focusItem, items]);

  // Update current index when focus changes
  useEffect(() => {
    const handleFocusChange = () => {
      const focusedIndex = items.findIndex(item => item === document.activeElement);
      if (focusedIndex !== -1) {
        currentIndexRef.current = focusedIndex;
      }
    };

    items.forEach(item => {
      item.addEventListener('focus', handleFocusChange);
    });

    return () => {
      items.forEach(item => {
        item.removeEventListener('focus', handleFocusChange);
      });
    };
  }, [items]);

  return {
    focusItem,
    currentIndex: currentIndexRef.current
  };
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus trap for modals
export const useFocusTrap = (isActive: boolean) => {
  const trapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !trapRef.current) return;

    const trap = trapRef.current;
    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus first element when trap activates
    firstElement?.focus();

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return trapRef;
}; 