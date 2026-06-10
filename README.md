
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

## 🔐 Google Sign-In: Cross-Device Troubleshooting
If users on other devices see **"Missing Initial State"** or **"Unable to process request"**:

### A. Google Cloud Console (The Master Fix)
1.  Open [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials).
2.  Find **OAuth 2.0 Client IDs**. There are usually two "Web client" entries. 
3.  **Edit the TOP one** (The one created by Google Service).
4.  **Authorized JavaScript origins**: Add `https://mantravahini.vercel.app` AND `https://studio-9442084622-48e5f.firebaseapp.com`.
5.  **Authorized redirect URIs**: Add ONLY `https://studio-9442084622-48e5f.firebaseapp.com/__/auth/handler`.
    *   *Do NOT add the Vercel link to the Redirect URIs section.*
6.  **Save and Wait**: It takes **10 minutes** for Google's servers to sync.

### B. Device Settings (For Mobile Users)
The error is often caused by the browser blocking the login "handshake" cookie.
1.  **Avoid Incognito**: Google Login will likely fail in Private/Incognito mode on mobile.
2.  **Enable Cookies**: Ensure "Block third-party cookies" is **OFF** in Chrome/Safari settings.
3.  **App Access**: Use these credentials for Play Store reviewers:
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
1.  **App Access**: Provide the test credentials listed above in the Play Console.
2.  **Medical Claims**: Never say the app "cures." Use "spiritual wellness" or "comfort."
3.  **Data Safety**:
    - **Account Deletion URL**: `https://mantravahini.vercel.app/delete-account`
    - Declare that you collect Name and Email for account functionality.
