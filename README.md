
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini)

A serene mantra playback and healing application built with Next.js, Firebase, and Genkit.

## 📱 Mobile APK Workflow (The Big Picture)

To turn this web app into a mobile app, you use three tools in harmony:

1.  **Firebase Studio (This Editor)**: Your primary home. Change UI, add mantras, and update logic here.
2.  **Antigravity 2.0 (Local Manager)**: The bridge. It pulls your code from the cloud and prepares it for Android.
3.  **Android Studio (The Factory)**: The final step. It takes the bridged project and compiles it into the actual `.apk` file.

### 🚀 Live Updates (No Rebuilds Required)
Because this app is a **Web-Shell** pointing to your Vercel URL:
- **Push to Git = Update APK**. 
- Any change you make here in Firebase Studio and push to GitHub will automatically update the app on every user's phone instantly.
- You only need to build a new APK again if you change the App Icon, Splash Screen, or App Name.

## 🛠 Step-by-Step APK Guide

### 1. Prepare Code here in Firebase Studio
Make your changes and ensure your code is pushed to your GitHub repository.

### 2. Setup Antigravity 2.0 on Windows
- **Download & Install**: Choose **Antigravity 2.0**.
- **Login**: Use your account to see your project.
- **Clone**: Pull the project to a folder on your local `C:` or `D:` drive.

### 3. Build & Sync (The "Bridge" Step)
Open the terminal inside Antigravity (or VS Code locally) and run:

```bash
# Install dependencies locally
npm install

# Prepare the web files
npm run build

# Sync to Android
npx cap sync
```

### 4. Create the APK (The "Factory" Step)
- In the terminal, run: `npx cap open android`.
- **Android Studio** will open.
- Wait for the "Gradle Sync" to finish (the bar at the bottom).
- Go to **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
- Once finished, a notification will pop up. Click "locate" to find your `.apk` file!

## 🛠 Admin Access

To access administrative features:
1. **Log in** to the app.
2. **Promote your account**: The developer UID is `LPBTRz3AMafKtZVgzJWm5Aisxc53`. If you are using a different account, update the UID in `firestore.rules` and `src/app/admin/users/page.tsx`.
