import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Setup multer for recordings
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads');
      if (!require('fs').existsSync(uploadPath)) {
        require('fs').mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  const upload = multer({ storage });

  // Mock database for the demo
  const mockActivity = [
    { id: 1, type: 'app_launch', detail: 'YouTube Kids', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: 2, type: 'search', detail: 'how to build lego castle', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 3, type: 'screen_on', detail: 'Unlock attempt success', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  ];

  const mockRecordings = [
    { id: 'rec-1', name: 'Recording_11AM.mp4', size: '45MB', date: '2026-04-18 11:00' },
    { id: 'rec-2', name: 'Recording_10AM.mp4', size: '52MB', date: '2026-04-18 10:00' },
    { id: 'rec-3', name: 'Recording_09AM.mp4', size: '38MB', date: '2026-04-18 09:00' },
  ];

  // API Routes
  app.get("/api/activity", (req, res) => {
    res.json(mockActivity);
  });

  app.get("/api/recordings", (req, res) => {
    const fs = require('fs');
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
        return res.json([]);
    }
    const files = fs.readdirSync(uploadPath);
    const recordings = files.map((file: string, index: number) => {
        const stats = fs.statSync(path.join(uploadPath, file));
        return {
            id: `rec-${index}`,
            name: file,
            size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
            date: stats.mtime.toISOString().replace('T', ' ').substring(0, 16)
        };
    }).sort((a: any, b: any) => b.date.localeCompare(a.date));
    res.json(recordings);
  });

  app.post("/api/upload", upload.single('video'), (req, res) => {
    console.log("Recording received:", req.file?.filename);
    res.json({ success: true, message: "Recording uploaded successfully." });
  });

  // Serve the actual video files
  app.use('/api/recordings/files', express.static(path.join(process.cwd(), 'uploads')));

  app.get("/api/status", (req, res) => {
    res.json({ 
      active: true, 
      recording: true, 
      lastSync: new Date().toISOString(),
      storageUsed: "1.2GB / 10GB" 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Guardian Server running on http://localhost:${PORT}`);
  });
}

startServer();
