
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
    allowMixedContent: true
  }
};

export default config;
