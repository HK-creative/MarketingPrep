import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  isActive: boolean;
  particleCount?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  delay: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ 
  isActive, 
  particleCount = 50 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const colors = ['#00BFA6', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#C7CEEA', '#FF9FF3', '#54A0FF'];

  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          delay: Math.random() * 1.5,
        });
      }
      
      setParticles(newParticles);
      
      // Clear particles after animation
      const timeout = setTimeout(() => {
        setParticles([]);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isActive, particleCount]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti animate-confetti"
          style={{
            left: `${particle.x}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}; 