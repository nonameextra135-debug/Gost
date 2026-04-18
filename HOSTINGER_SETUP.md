# Hostinger Setup Guide: GuardianCalc Command Center

To run the Parent Dashboard (Command Center) on Hostinger with zero delay, follow these instructions based on your hosting plan.

### Option A: Hostinger Node.js Hosting (Recommended)
If you have Hostinger's specific "Node.js Hosting" plan:
1.  **Dashboard**: Go to your Hostinger hPanel > Node.js.
2.  **Upload**: Upload all files from this project (including `server.ts`, `package.json`, and the `src` folder).
3.  **Install**: Click **"NPM Install"** in the hPanel to set up dependencies.
4.  **Entry Point**: Set the Application Entry Point to `server.ts`.
5.  **Environment Variables**: Add your `GEMINI_API_KEY` in the Environment Variables section.
6.  **Run**: Start the application. Your dashboard will be live at `yourdomain.com`.

### Option B: Hostinger VPS (For Pros)
If you have a Hostinger VPS (CyberPanel or plain Ubuntu):
1.  **Terminal**: Connect via SSH.
2.  **Setup Node**: Install Node.js (`curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -`).
3.  **Process Manager**: Install PM2 (`npm install -g pm2`) to keep the server running forever.
4.  **Deploy**:
    ```bash
    git clone <your-repo-link>
    npm install
    npm run build
    pm2 start tsx -- server.ts --name guardian-server
    ```
5.  **Firewall**: Ensure Port 3000 (or your configured port) is open.

### Option C: Shared Hosting (Legacy)
**Note**: Standard Shared Hosting usually does not support Node.js directly. 
- If you only have Shared Hosting, you would need to convert this to a PHP backend (which is much more complex for zero-delay video uploads).
- **Recommendation**: Upgrade to a Small VPS (starts around $4/mo) for the best reliability with high-speed video processing.

### Critical: Storage
- Video files take a lot of space. Ensure your Hostinger plan has at least **20GB+ of NVMe storage** if you plan to keep archives for more than a few days.
- Regularly clear the `uploads/` folder or sync it to a cloud storage like Google Drive or AWS S3.
