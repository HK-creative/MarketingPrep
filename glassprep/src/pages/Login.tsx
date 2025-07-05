import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyPIN, setAuthenticated, initializePIN } from '../utils/auth';
import { usePageAnimation } from '../hooks/useAnimations';

export const Login: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isVisible = usePageAnimation();

  useEffect(() => {
    // Initialize PIN on first load
    initializePIN();
  }, []);

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
      setError(false);
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) return;
    
    setLoading(true);
    try {
      const isValid = await verifyPIN(pin);
      
      if (isValid) {
        setAuthenticated(true);
        navigate('/');
      } else {
        setError(true);
        setPin('');
        // Vibrate if available
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-submit when 4 digits are entered
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`glass p-8 max-w-md w-full transform transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
      }`}>
        <h1 className="text-4xl font-bold text-center mb-2 animate-fadeInUp">GlassPrep</h1>
        <p className="text-center text-gray-300 mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>Enter your PIN to continue</p>
        
        {/* PIN Display */}
        <div className="flex justify-center gap-4 mb-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-16 h-16 glass flex items-center justify-center text-2xl font-bold transition-all transform hover:scale-110 ${
                error ? 'border-red-500 animate-shake' : ''
              } ${pin.length > index ? 'border-accent shadow-lg shadow-accent/30 animate-pulse-glow' : ''}`}
            >
              {pin[index] ? '●' : ''}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mb-4 animate-pulse">
            Incorrect PIN. Please try again.
          </p>
        )}

        {/* PIN Keypad */}
        <div className="grid grid-cols-3 gap-4 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit, index) => (
            <button
              key={digit}
              onClick={() => handleDigitClick(digit.toString())}
              disabled={loading}
              className="pin-input glass-hover flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all duration-200"
              style={{ animationDelay: `${0.7 + index * 0.05}s` }}
              aria-label={`Digit ${digit}`}
            >
              {digit}
            </button>
          ))}
          
          <button
            onClick={handleClear}
            disabled={loading}
            className="pin-input glass-hover flex items-center justify-center text-sm"
            aria-label="Clear"
          >
            Clear
          </button>
          
          <button
            onClick={() => handleDigitClick('0')}
            disabled={loading}
            className="pin-input glass-hover flex items-center justify-center"
            aria-label="Digit 0"
          >
            0
          </button>
          
          <button
            onClick={handleBackspace}
            disabled={loading}
            className="pin-input glass-hover flex items-center justify-center"
            aria-label="Backspace"
          >
            ←
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Default PIN: 1234
        </p>
      </div>
    </div>
  );
}; 