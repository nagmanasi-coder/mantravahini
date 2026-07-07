/**
 * ADMOB CONFIGURATION
 * 
 * Updated with PRODUCTION Ad Unit IDs.
 */
export const ADMOB_CONFIG = {
  // Official Google Test App ID for Android (Replace with your PRODUCTION App ID from AdMob Console if different)
  appId: "ca-app-pub-3940256099942544~3347511713", 

  // Ad Unit IDs
  units: {
    banner: {
      android: "ca-app-pub-3648420983615754/2904804439", 
      ios: "ca-app-pub-3940256099942544/2934735716", // Placeholder for iOS
    },
    rewarded: {
      android: "ca-app-pub-3648420983615754/7199272664", 
      ios: "ca-app-pub-3940256099942544/1712485313", // Placeholder for iOS
    },
    native: {
      android: "ca-app-pub-3648420983615754/7442850639", 
      ios: "ca-app-pub-3940256099942544/3986624511", // Placeholder for iOS
    }
  },
  
  // Strategy: Rewarded Ads are the primary unlock mechanism for Free users
  rewardedUnlockEnabled: true,
  
  // Testing mode (Automatically becomes false in production builds)
  testing: process.env.NODE_ENV !== 'production'
};

/**
 * Utility to detect if the app is running in a Native/APK context.
 */
export function isNativePlatform(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for Capacitor (Native Bridge) or PWA Standalone Mode
  const isCapacitor = !!(window as any).Capacitor;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  return isCapacitor || isStandalone;
}
