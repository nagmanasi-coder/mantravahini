
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mantravaahini.app',
  appName: 'Mantravaahini',
  webDir: 'out',
  server: {
    // This allows the APK to point directly to your Vercel deployment
    // ensuring Genkit and Firebase features work seamlessly.
    url: 'https://mantravahini.vercel.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
