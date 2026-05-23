
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini)

A serene mantra playback and healing application built with Next.js, Firebase, and Genkit.

## 🚀 Mobile APK Strategy: Option A (Web-Shell)

We have chosen **Option A (Remote URL wrapper)** for this app. 

### Why Option A?
*   **AI Support**: Your Genkit AI flows (Server Actions) require a live server connection. Bundling locally would break them.
*   **Live Updates**: Any change you push to GitHub will instantly update the app on users' phones without needing a new Play Store submission.
*   **Play Store Ready**: Our UI includes a native-feeling Splash Screen, professional styling, and Bottom Ads, ensuring a high-quality experience for Google reviewers.

## 🎨 App Icon & Native Splash Screen
While our web code has a splash screen, the "Home Screen Icon" and the "Initial Loading Image" are part of the Android project.
1.  **Icon**: Open your project in Android Studio, right-click the `app` folder -> `New` -> `Image Asset`.
2.  **Native Splash**: Use the `@capacitor/assets` tool or replace the `splash.png` files in `android/app/src/main/res/`.

## 🛠 Step-by-Step APK Guide for Antigravity 2.0

### 1. Prepare Environment
*   Ensure your latest code is pushed to your GitHub repository.
*   Ensure your Vercel deployment (`https://mantravahini.vercel.app`) is active.

### 2. Antigravity 2.0 Setup (Windows)
*   **Install Antigravity 2.0** and log in.
*   **Clone** your repository to a folder on your `C:` drive.
*   Open the terminal inside Antigravity and run:

```bash
# Install dependencies
npm install

# Build the project (creates the 'out' folder)
npm run build

# Sync the code to the Android project
npx cap sync
```

### 3. Generate the APK (Android Studio)
*   In the Antigravity terminal, run: `npx cap open android`.
*   **Android Studio** will launch automatically.
*   Wait for the "Gradle Sync" to finish.
*   Go to **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
*   Click "locate" in the popup to find your `.apk` file!

## 🛠 Admin & Developer Access
*   **Developer UID**: `LPBTRz3AMafKtZVgzJWm5Aisxc53`
*   **Manage Users**: Accessible via the profile menu when logged in as the developer.
*   **Manage Testimonials**: Admins can delete submissions directly from the management interface.
