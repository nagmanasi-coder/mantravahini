
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini) - ZEB-PC Manual AAB Guide

This guide is for building your production **Android App Bundle (.aab)** manually using Android Studio on your local Windows machine.

## 🛠 Prerequisites for ZEB-PC
*   **Android Studio**: Latest version installed.
*   **Java**: OpenJDK 17 (C:/Users/ZEB-PC/AppData/Local/Android/Sdk/...)
*   **Project Location**: `C:\Users\ZEB-PC\.gemini\antigravity\scratch\pwa-android-wrapper`

---

## 📦 Step 1: Prepare the Project (Terminal)
Open a terminal in your project root and run these commands to sync your latest web changes (from Git/Vercel) to the Android wrapper:

```bash
# 1. Update your Capacitor configuration if you changed the Vercel URL
# 2. Synchronize your project
npx cap sync android
```

---

## 🎨 Step 2: Set Native Assets (Android Studio)
Open your project folder in **Android Studio**.

### A. App Icon
1.  In the Project view (left), right-click the `app` folder.
2.  Select **New > Image Asset**.
3.  Choose your icon file and follow the wizard to generate all resolutions.

### B. AdMob App ID
1.  Open `android/app/src/main/AndroidManifest.xml`.
2.  Find the `<meta-data>` tag with `com.google.android.gms.ads.APPLICATION_ID`.
3.  Replace the **Test ID** with your **Real Production AdMob App ID** from the Google AdMob Console.

---

## 🔐 Step 3: Generate Signed AAB (The Factory)
1.  In Android Studio, go to **Build > Generate Signed Bundle / APK...**.
2.  Select **Android App Bundle** and click Next.
3.  **Key store path**: Click "Create new..." if you don't have one. Save this file safely! (e.g., `mantravaahini.jks`).
4.  Fill in the passwords and alias. **Write these down; you need them for every update.**
5.  Select **release** variant and click Finish.

**Location of your file**: `android/app/release/app-release.aab`

---

## 🔄 Live Update Workflow (No Re-build Needed)
Since we are using **Option A (Remote URL)**:
1.  Edit code here in Firebase Studio.
2.  Push to Git.
3.  Vercel updates the website.
4.  **Done!** Your installed APKs/AABs will show the new code immediately when opened.

---

## 🛠 Security & Admin
*   **Admin Access**: Managed via the user profile menu.
*   **Testimonials**: No approval needed. All results are live. Admins can delete via the "Manage Testimonials" section.
