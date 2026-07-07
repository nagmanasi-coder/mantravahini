/**
 * ADMOB CONFIGURATION
 * 
 * This file centralizes your ad strategy. 
 * - APK Users: Triggers real AdMob logic (via Capacitor plugin).
 * - Web Users: Shows simulated ads to maintain the business model.
 */
export const ADMOB_CONFIG = {
  // Your AdMob App ID from Google Console
  appId: "ca-app-pub-3940256099942544~3347511713", // Test App ID

  // Ad Unit IDs (Mapping to real console IDs)
  units: {
    banner: {
      android: "ca-app-pub-3940256099942544/6300978111",
      ios: "ca-app-pub-3940256099942544/2934735716",
    },
    rewarded: {
      android: "ca-app-pub-3940256099942544/5224354917", // HIGH REVENUE - Unlocks Mantras
      ios: "ca-app-pub-3940256099942544/1712485313",
    },
    native: {
      android: "ca-app-pub-3940256099942544/2247696110", // Native Advanced - Blends into lists
      ios: "ca-app-pub-3940256099942544/3986624511",
    }
  },
  
  // Strategy: Rewarded Ads are the primary unlock mechanism for Free users
  rewardedUnlockEnabled: true,
  
  // Testing mode (Set to false for production APK builds)
  testing: true
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
