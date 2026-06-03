
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini) - Production Release Guide

This guide covers building your **Android App Bundle (.aab)** and deploying your web code to **Vercel**.

---

## 🌍 Step 0: Publish to Vercel (Web Code)
To make your app live and update your APKs automatically:

1.  **Connect GitHub**: In the Firebase Studio UI, push your latest code to a GitHub repository.
2.  **Import to Vercel**: 
    *   Go to [Vercel.com](https://vercel.com) and click **"Add New" > "Project"**.
    *   Select your GitHub repository.
3.  **Environment Variables (CRITICAL)**: 
    *   In the Vercel dashboard for your project, go to **Settings > Environment Variables**.
    *   Add the following keys exactly as shown (do NOT use `NEXT_PUBLIC_` for these):
        *   `GOOGLE_GENAI_API_KEY`: Get this from [Google AI Studio](https://aistudio.google.com/).
        *   `SARVAM_AI_API_KEY`: Your Sarvam AI key (Used for Kannada AI features).
4.  **Deploy**: Click Deploy. Your site is now live at `https://mantravahini.vercel.app`.

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
3.  Choose your icon file and follow the wizard to generate all resolutions.

### B. Versioning
Open `android/app/build.gradle`. Update `versionCode` and `versionName` for every new release you submit to the Play Store.

---

## 🔐 Step 3: Generate Signed AAB (The Final Product)
1.  In Android Studio, go to **Build > Generate Signed Bundle / APK...**.
2.  Select **Android App Bundle** and click Next.
3.  **Key store path**: Create a new `.jks` file. **CRITICAL: Save this file and your password safely. You need this for every future update.**
4.  Select **release** variant and click Finish.

**File Location**: `android/app/release/app-release.aab`

---

## 🛡️ Play Store Approval Tips
1.  **Medical Claims**: Never say the app "cures" a disease. Use words like "supports wellness" or "spiritual comfort."
2.  **Data Safety**: In the Play Console, declare that you collect "Name" and "Email" for account functionality and "Video/Audio" if users upload testimonials.
3.  **Testing**: Always run your AAB on a real device before uploading to ensure the splash screen and audio player work as expected.

---

## 🔄 Live Update Workflow
Because this app is a Hybrid Web App:
1.  Edit code in Firebase Studio.
2.  Push to Git.
3.  Vercel updates the website.
4.  **Done!** Your installed users will see the new code immediately without them needing to update the app from the Play Store (unless you change native permissions).
