
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini)

A serene mantra playback and healing application built with Next.js, Firebase, and Genkit.

## APK Development Workflow (Firebase Studio -> GitHub -> APK)

This project is optimized to be wrapped into a mobile app using **Capacitor**.

### 1. Update Code in Firebase Studio
Make all your UI and logic changes here.

### 2. Push to GitHub
Sync your changes to your GitHub repository. Vercel will automatically deploy the latest version to `https://mantravahini.vercel.app`.

### 3. Build APK Locally (Using Capacitor)
On your local machine (where Android Studio is installed):

```bash
# 1. Pull latest code from GitHub
git pull origin main

# 2. Install dependencies
npm install

# 3. Add Android platform (First time only)
npx cap add android

# 4. Sync web changes to Native
npm run cap:sync

# 5. Open in Android Studio
npm run cap:open
```

In **Android Studio**:
- Select **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
- Once finished, you can install the `.apk` on any Android device.

## 🚀 Live Updates (No APK Rebuild Required)

Since this APK is configured as a **Web-Shell** pointing to your Vercel URL:
- **Any changes you push to Git will update the APK automatically.**
- Users do **not** need to download a new APK to see UI changes, new mantras, or logic updates.
- You only need to rebuild the APK if you change the App Icon, App Name, or add new native hardware plugins.

## 🛠 Admin Access Instructions

To access administrative features (User Management):

1. **Log in** to the application.
2. **Find your UID**: Click your profile avatar. If you aren't an admin, your UID is at the bottom of the menu.
3. **Promote your account**: Update the developer UID in the following files with your own:
   - `src/app/admin/users/page.tsx`
   - `src/app/components/auth/UserProfile.tsx`
   - `src/app/components/standalone-audio-player.tsx`
   - `firestore.rules` (Update the `isDeveloper()` function)
4. **Deploy**: Push changes to GitHub/Vercel.

## Features

- **Mantra Playback**: Specialized mantras for pain relief and eye health.
- **AI Kalajnana**: Daily personalized horoscopes generated via Genkit.
- **Painful Memories**: EMDR-style guided sessions for emotional healing.
- **Prana Vidya**: Spiritual progression system for practitioners.
- **Native Experience**: Status bar styling and safe-area adjustments for notched phones.
