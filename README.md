
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini) - ZEB-PC Manual AAB Guide

This guide is for building your production **Android App Bundle (.aab)** manually using Android Studio on your local Windows machine, and keeping your web code synced via Vercel.

---

## 🚀 Step 0: Publish to Vercel (Web Code)
To make your app live and update your APKs automatically:
1.  **Connect GitHub**: In the Firebase Studio UI, look for the **"Source Control"** or **"Git"** tab.
2.  **Initialize & Push**: Create a new repository on GitHub (e.g., `mantravaahini-app`) and push your code from here.
3.  **Import to Vercel**: 
    *   Go to [Vercel.com](https://vercel.com) and click **"Add New" > "Project"**.
    *   Select your GitHub repository.
    *   **Environment Variables**: Add your Firebase keys (from `src/firebase/config.ts`) as Environment Variables in the Vercel dashboard.
4.  **Deploy**: Click Deploy. Your site is now live at `https://mantravahini.vercel.app`.

---

## 📦 Step 1: Prepare the Project (Terminal)
Once your Vercel site is live, open a terminal on your **ZEB-PC** in the project root:

```bash
# This command "Syncs" your Vercel URL and AdMob settings into the Android project.
npx cap sync android
```

### 💡 What does `npx cap sync android` do?
*   **Sync**: It updates the "android" folder with your latest Vercel URL (from `capacitor.config.ts`) and links native plugins like AdMob.

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
3.  **Key store path**: Click "Create new..." if you don't have one. Save this file safely! (e.g., `mantravaahini.jks`).
4.  Fill in the passwords and alias. **Write these down; you need them for every update.**
5.  Select **release** variant and click Finish.

**Location of your file**: `android/app/release/app-release.aab`

---

## 🔄 Live Update Workflow (No Re-build Needed)
1.  Edit code here in Firebase Studio.
2.  Push to Git.
3.  Vercel updates the website.
4.  **Done!** Your installed APKs/AABs will show the new code immediately when opened because they load the Vercel URL directly.

---

## 🛠 Security & Admin
*   **Admin Access**: Managed via the user profile menu.
*   **Testimonials**: All results are live. Admins can delete via the "Manage Testimonials" section.
