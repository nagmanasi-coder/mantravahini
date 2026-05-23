
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mantravaahini.app',
  appName: 'Mantravaahini',
  webDir: 'out',
  server: {
    // This points to your LIVE Vercel production URL.
    // This allows for Live Updates without re-submitting to the Play Store.
    url: 'https://mantravahini.vercel.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
