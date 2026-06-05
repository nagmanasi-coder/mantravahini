
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
    *   Add the following keys exactly as shown:
        *   `GOOGLE_GENAI_API_KEY`: Get this from [Google AI Studio](https://aistudio.google.com/).
        *   `SARVAM_AI_API_KEY`: Your Sarvam AI key (Used for Kannada AI features).
4.  **Firebase Console Configuration (Google Sign-In)**:
    *   Go to **Authentication > Sign-in method** and enable **Google**.
    *   Go to **Authentication > Settings > Authorized domains**.
    *   Ensure these two domains are added (**Domain name only**, no https://):
        1. `mantravahini.vercel.app`
        2. `studio-9442084622-48e5f.firebaseapp.com`

---

## 🔐 Google Sign-In Troubleshooting
If you see "The requested action is invalid" or "Configuration Not Found":

1.  **Wait 5-10 minutes**: Firebase changes can take time to propagate to Google's servers.
2.  **Google Cloud Console Check**:
    *   Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
    *   Find the **OAuth 2.0 Client IDs** section.
    *   Click on the one named **"Web client (auto created by Google Service)"**.
    *   Under **Authorized JavaScript origins**, add: `https://mantravahini.vercel.app`
    *   Under **Authorized redirect URIs**, add: `https://studio-9442084622-48e5f.firebaseapp.com/__/auth/handler`
    *   Save and wait a few minutes.

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
1.  **App Access (Credentials)**: When submitting, provide these in the "App Access" section:
    - **Email:** review@yourdomain.com
    - **Password:** YourTestPassword
2.  **Medical Claims**: Never say the app "cures" a disease. Use words like "supports wellness" or "spiritual comfort." (We have already cleaned the code for this).
3.  **Data Safety**: In the Play Console, declare that you collect "Name" and "Email" for account functionality and "Video/Audio" if users upload testimonials.
4.  **Testing**: Always run your AAB on a real device before uploading to ensure the splash screen and audio player work as expected.
