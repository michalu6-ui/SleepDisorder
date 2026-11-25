export function pulseVibrate(pattern: number[] = [40, 120, 40]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}