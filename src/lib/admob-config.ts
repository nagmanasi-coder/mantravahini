/**
 * ADMOB CONFIGURATION
 * 
 * Updated with Google Test App ID for the testing period.
 * REPLACE the placeholders below with your REAL IDs from the AdMob Console
 * when you are ready to publish to the Play Store.
 */
export const ADMOB_CONFIG = {
  // Official Google Test App ID for Android
  appId: "ca-app-pub-3940256099942544~3347511713", 

  // Ad Unit IDs (Mapping to real console IDs)
  units: {
    banner: {
      // PROD ID: Replace with your "Banner" unit ID
      android: "ca-app-pub-3940256099942544/6300978111", 
      ios: "ca-app-pub-3940256099942544/2934735716",
    },
    rewarded: {
      // PROD ID: Replace with your "Rewarded" unit ID
      android: "ca-app-pub-3940256099942544/5224354917", 
      ios: "ca-app-pub-3940256099942544/1712485313",
    },
    native: {
      // PROD ID: Replace with your "Native Advanced" unit ID
      android: "ca-app-pub-3940256099942544/2247696110", 
      ios: "ca-app-pub-3940256099942544/3986624511",
    }
  },
  
  // Strategy: Rewarded Ads are the primary unlock mechanism for Free users
  rewardedUnlockEnabled: true,
  
  // Testing mode (Set to false for production APK builds)
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
