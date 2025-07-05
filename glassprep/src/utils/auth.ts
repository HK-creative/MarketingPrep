// Authentication utilities for GlassPrep

export const DEFAULT_PIN = '1234'; // Default PIN for first-time setup

// Hash PIN using Web Crypto API (SHA-256)
export async function hashPIN(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const authToken = sessionStorage.getItem('glassprep_auth');
  return authToken === 'authenticated';
}

// Set authentication status
export function setAuthenticated(status: boolean): void {
  if (status) {
    sessionStorage.setItem('glassprep_auth', 'authenticated');
  } else {
    sessionStorage.removeItem('glassprep_auth');
  }
}

// Get stored PIN hash
export function getStoredPINHash(): string | null {
  return localStorage.getItem('glassprep_pin_hash');
}

// Set PIN hash
export async function setPINHash(pin: string): Promise<void> {
  const hash = await hashPIN(pin);
  localStorage.setItem('glassprep_pin_hash', hash);
}

// Verify PIN
export async function verifyPIN(pin: string): Promise<boolean> {
  const storedHash = getStoredPINHash();
  
  // If no PIN is set, use default PIN
  if (!storedHash) {
    const defaultHash = await hashPIN(DEFAULT_PIN);
    const inputHash = await hashPIN(pin);
    return inputHash === defaultHash;
  }
  
  const inputHash = await hashPIN(pin);
  return inputHash === storedHash;
}

// Initialize PIN on first use
export async function initializePIN(): Promise<void> {
  const storedHash = getStoredPINHash();
  if (!storedHash) {
    await setPINHash(DEFAULT_PIN);
  }
} 