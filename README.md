
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini)

A serene mantra playback and healing application built with Next.js, Firebase, and Genkit.

## 📱 Mobile APK Workflow (The Big Picture)

To turn this web app into a mobile app, you use three tools in harmony:

1.  **Firebase Studio (This Editor)**: Your primary home. Change UI, add mantras, and update logic here.
2.  **Antigravity (Local Manager)**: Run Capacitor commands (`npx cap sync`) to bridge your web code to the Android world.
3.  **Android Studio (The Factory)**: The final step. It takes the bridged project and compiles it into the actual `.apk` file.

### 🚀 Live Updates (No Rebuilds Required)
Because this app is a **Web-Shell** pointing to your Vercel URL:
- **Push to Git = Update APK**. 
- Any change you make here in Firebase Studio and push to GitHub will automatically update the app on every user's phone instantly.
- You only need to use Antigravity/Android Studio again if you change the App Icon, Splash Screen, or App Name.

## 🛠 Setup & Build Instructions

### 1. Update Code in Firebase Studio
Make all your UI and logic changes here.

### 2. Push to GitHub
Sync your changes to your GitHub repository. Vercel will automatically deploy the latest version to `https://mantravahini.vercel.app`.

### 3. Build APK Locally (Using Antigravity + Android Studio)
On your local machine:

```bash
# 1. Pull latest code from GitHub
git pull origin main

# 2. Install dependencies
npm install

# 3. Sync web changes to Native (The "Bridge" step)
npm run cap:sync

# 4. Open in Android Studio (The "Factory" step)
npx cap open android
```

In **Android Studio**:
- Select **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
- Once finished, install the `.apk` on your device.

## 🛠 Admin Access

To access administrative features:

1. **Log in** to the app.
2. **Promote your account**: Update the developer UID in the following files with your own:
   - `src/app/admin/users/page.tsx`
   - `src/app/components/auth/UserProfile.tsx`
   - `src/app/components/standalone-audio-player.tsx`
   - `firestore.rules` (Update the `isDeveloper()` function)
