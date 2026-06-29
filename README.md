
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini) - Production Release Guide

This guide covers building your **Android App Bundle (.aab)** and deploying your web code to **Vercel**.

---

## 🌍 Step 0: Publish to Vercel (Web Code)
To make your app live and update your APKs automatically:

1.  **Connect GitHub (Manual Fallback)**:
    If the Studio UI button for Git is not responding, use these commands in the terminal:
    ```bash
    git remote add origin https://github.com/nagmanasi-coder/mantravahini.git
    git add .
    git commit -m "sync: latest production code"
    git push -u origin main
    ```
2.  **Import to Vercel**: 
    *   Go to [Vercel.com](https://vercel.com) and click **"Add New" > "Project"**.
    *   Select your GitHub repository.
3.  **Environment Variables (CRITICAL)**: 
    *   In the Vercel dashboard, go to **Settings > Environment Variables**.
    *   Add:
        *   `GOOGLE_GENAI_API_KEY`: From Google AI Studio.
        *   `SARVAM_AI_API_KEY`: Your Sarvam AI key.

---

## 🔐 Authentication & Access
The app uses **Email/Password** and **Guest Access** for maximum compatibility with the Android WebView.

### App Access (For Play Store Reviewers)
Use these credentials for reviewers:
*   **Email:** review@yourdomain.com
*   **Password:** YourTestPassword

---

## 📦 Step 1: Sync Capacitor (Terminal)
Once your Vercel site is live, open a terminal on your computer in the project root:

```bash
# This command "Syncs" your Vercel URL and native settings into the Android project.
npx cap sync android
```

---

## 🎨 Step 2: Set Native Assets (Android Studio)
Open the `android` folder in **Android Studio**.

### A. App Icon
1.  In the Project view, right-click the `app` folder.
2.  Select **New > Image Asset**.
3.  Choose your icon file to generate all resolutions.

### B. Versioning
Open `android/app/build.gradle`. Update `versionCode` and `versionName` for every new release.

---

## 🛡️ Play Store Approval Tips
1.  **Medical Claims**: Never say the app "cures." Use "spiritual wellness" or "comfort."
2.  **Data Safety**:
    - **Account Deletion URL**: `https://mantravahini.vercel.app/delete-account`
    - Declare that you collect Name and Email for account functionality.
