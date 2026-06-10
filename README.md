
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

## 🔐 Google Sign-In Troubleshooting (Fix for "Missing Initial State")
If you see the error **"Unable to process request due to missing initial state"** (as shown in your screenshot), follow these exact steps:

1.  **Open Google Cloud Console**: Go to the [Google Cloud Credentials Page](https://console.cloud.google.com/apis/credentials).
2.  **Find your OAuth Client**: Look for the section **"OAuth 2.0 Client IDs"**. Click the edit (pencil) icon next to the one named **"Web client (auto created by Google Service)"**.
3.  **Add Authorized JavaScript origins**:
    *   `https://mantravahini.vercel.app`
    *   `https://studio-9442084622-48e5f.firebaseapp.com`
4.  **Add Authorized redirect URIs (THIS IS THE FIX)**:
    *   `https://studio-9442084622-48e5f.firebaseapp.com/__/auth/handler`
5.  **Save and Wait**: Click "Save". It can take up to 10 minutes for Google to update their global servers.
6.  **Browser Tip**: Ensure the user is not in "Incognito/Private" mode, as some browsers block the sign-in state in those modes.

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
1.  **App Access (Credentials)**: Use these for the "App Access" section in Play Console:
    - **Email:** review@yourdomain.com
    - **Password:** YourTestPassword
2.  **Medical Claims**: Never say the app "cures" a disease. Use words like "supports wellness" or "spiritual comfort."
3.  **Data Safety**:
    - **URL for account deletion**: `https://mantravahini.vercel.app/delete-account`
    - Declare that you collect Name and Email for account functionality.
4.  **Testing**: Always run your AAB on a real device before uploading to ensure the splash screen and audio player work as expected.
