
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini)

A serene mantra playback and healing application built with Next.js, Firebase, and Genkit.

## 🚀 Mobile APK Strategy: Option A (Web-Shell)

We have chosen **Option A (Remote URL wrapper)** for this app. This allows for **Live Updates** without re-submitting to the Play Store.

### 🛠 Local Build Environment (ZEB-PC)
*   **Java Version**: OpenJDK 17 (Java 17)
*   **Capacitor Version**: 6.x
*   **SDK Path**: `C:/Users/ZEB-PC/AppData/Local/Android/Sdk`
*   **Wrapper Folder**: `C:\Users\ZEB-PC\.gemini\antigravity\scratch\pwa-android-wrapper`

## 🎨 App Icon & Native Splash Screen
While our web code has a splash screen, the "Home Screen Icon" and the "Initial Loading Image" are part of the Android project.
1.  **Icon**: Open your project in Android Studio, right-click the `app` folder -> `New` -> `Image Asset`.
2.  **Native Splash**: Use the `@capacitor/assets` tool or replace the `splash.png` files in `android/app/src/main/res/`.

## ⚡ Step-by-Step APK Guide for Antigravity 2.0

### 1. Update Project URL
If you change your Vercel URL, update `capacitor.config.ts` (or `capacitor.config.json`) in your project root:
```json
"server": {
  "url": "https://mantravahini.vercel.app",
  "cleartext": true
}
```

### 2. Synchronize & Compile (Debug APK)
Open the Antigravity 2.0 terminal in your project directory and run:
```bash
# Sync web changes to the Android folder
npx cap sync android

# Move into the android folder and build the testing APK
cd android
.\gradlew.bat assembleDebug
```
The testing APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

### 3. Build Production AAB (Play Store Release)
When ready to publish, generate the App Bundle:
```bash
cd android
.\gradlew.bat bundleRelease
```
The release bundle will be located at: `android/app/build/outputs/bundle/release/app-release.aab`
*Note: Ensure your Production AdMob App ID is set in `AndroidManifest.xml` before building.*

## 🔄 Live Update Workflow
1.  **Change Code**: Edit here in Firebase Studio.
2.  **Push to Git**: Push your changes to GitHub.
3.  **Vercel Auto-Deploy**: Vercel updates the web version.
4.  **Automatic Sync**: Your installed APKs will automatically show the latest version the next time they are opened. **No need to rebuild the APK!**

## 🛠 Admin & Developer Access
*   **Developer UID**: `LPBTRz3AMafKtZVgzJWm5Aisxc53`
*   **Manage Users**: Accessible via the profile menu.
*   **Manage Testimonials**: Admins can delete submissions directly.
