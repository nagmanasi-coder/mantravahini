
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mantravaahini.app',
  appName: 'Mantravaahini',
  webDir: 'out',
  server: {
    // This points to your LIVE Vercel production URL.
    // This is required for Genkit AI flows and Firebase Auth to work in the APK.
    url: 'https://mantravahini.vercel.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    // Capacitor 6 specific settings for remote URL stability
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
