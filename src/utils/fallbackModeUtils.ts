// src/utils/fallbackModeUtils.ts

const FALLBACK_MODE_KEY = 'podcastAppFallbackMode';

export function setFallbackMode(value: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FALLBACK_MODE_KEY, JSON.stringify(value));
  }
}

export function getFallbackMode(): boolean {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(FALLBACK_MODE_KEY);
    return storedValue ? JSON.parse(storedValue) : false;
  }
  return false;
}

export function clearFallbackMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(FALLBACK_MODE_KEY);
  }
}