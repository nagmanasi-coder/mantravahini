
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
        *   `GOOGLE_GENAI_API_KEY`: Get this from [Google AI Studio](https://aistudio.google.com/). It is **NOT** the same as the Firebase API Key.
        *   `SARVAM_AI_API_KEY`: Your Sarvam AI key (Used for Kannada AI features).
    *   Copy all fields from `src/firebase/config.ts` if needed for browser-side Firebase access.
4.  **Deploy**: Click Deploy. Your site is now live at `https://mantravahini.vercel.app`.

---

## 📦 Step 1: Prepare the Project (Terminal)
Once your Vercel site is live, open a terminal on your **ZEB-PC** in the project root:

```bash
# This command "Syncs" your Vercel URL and AdMob settings into the Android project.
npx cap sync android
```

### 💡 What does `npx cap sync android` do?
It updates the "android" folder with your latest Vercel URL and links native plugins like AdMob.

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
3.  Replace the **Test ID** with your **Real Production AdMob App ID**.

---

## 🔐 Step 3: Generate Signed AAB (The Factory)
1.  In Android Studio, go to **Build > Generate Signed Bundle / APK...**.
2.  Select **Android App Bundle** and click Next.
3.  **Key store path**: Create a new `.jks` file and save it safely. **You need this for every update.**
4.  Select **release** variant and click Finish.

**File Location**: `android/app/release/app-release.aab`

---

## 🔄 Live Update Workflow (No Re-build Needed)
1.  Edit code in Firebase Studio.
2.  Push to Git.
3.  Vercel updates the website.
4.  **Done!** Your installed APKs will show the new code immediately because they load the Vercel URL directly.

---

## 🛠 Security & Admin
*   **Admin Access**: Managed via the user profile menu for the developer UID.
*   **Permissions**: Security rules are optimized to allow public reading of testimonials for a smooth community wall experience.
