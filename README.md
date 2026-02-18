
# ಮಂತ್ರವಾಹಿನಿ (Mantravaahini)

A serene mantra playback and healing application.

## Admin Access Instructions

To access the administrative features (User Management):

1. **Log in** to the application.
2. **Find your UID**: Click your profile avatar in the header. If you are not an admin, your UID will be displayed at the bottom of the menu. Use the copy button to grab it.
3. **Promote your account**: You must update the hardcoded developer UID in the following files with your own UID:
   - `src/app/admin/users/page.tsx`
   - `src/app/components/auth/UserProfile.tsx`
   - `src/app/components/standalone-audio-player.tsx`
   - `firestore.rules` (Update the `isDeveloper()` function)
4. **Deploy**: Once updated, redeploy your application.
5. **Access**: You will now see the **'Manage Users'** option in your profile menu.

## Features

- **Mantra Playback**: Specialized mantras for pain relief and eye health.
- **Mantra Therapy**: Information on Hanuman-based healing techniques.
- **Painful Memories Module**: A guided eye-tracking session for emotional healing.
- **User Manual**: Comprehensive guide available in Kannada and English, downloadable as PDF.
- **Special Products**: Showcase of medicated oils and the Akshaya Cash Box.
- **PWA Ready**: Can be installed on mobile devices for a native-like experience.
