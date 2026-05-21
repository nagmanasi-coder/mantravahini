
/**
 * ADMOB CONFIGURATION
 * 
 * Replace these placeholder IDs with your real AdMob IDs 
 * from the Google AdMob Console when you are ready to build the APK.
 */
export const ADMOB_CONFIG = {
  // Your AdMob App ID (from App Settings)
  appId: "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",

  // Unit IDs (created under 'Ad Units' in AdMob)
  units: {
    banner: {
      android: "ca-app-pub-3940256099942544/6300978111", // Test ID
      ios: "ca-app-pub-3940256099942544/2934735716",    // Test ID
    },
    interstitial: {
      android: "ca-app-pub-3940256099942544/1033173712", // Test ID
      ios: "ca-app-pub-3940256099942544/4411468910",    // Test ID
    },
    rewarded: {
      android: "ca-app-pub-3940256099942544/5224354917", // Test ID
      ios: "ca-app-pub-3940256099942544/1712485313",    // Test ID
    }
  },
  
  // Set to true to show real ads. Set to false for testing.
  testing: true
};
