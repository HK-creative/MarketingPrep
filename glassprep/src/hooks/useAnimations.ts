import { useEffect, useState } from 'react';

export function usePageAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return isVisible;
}

export function useStaggeredAnimation(itemCount: number, delay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, i * delay);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [itemCount, delay]);

  return visibleItems;
}

export function useCountAnimation(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;

    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export function useTypingAnimation(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    let index = 0;
    setDisplayText('');
    setIsComplete(false);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
}

export function useParallaxScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
} 