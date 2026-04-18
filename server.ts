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

  // Setup multer for "recordings" (simulated upload)
  const upload = multer({ dest: 'uploads/' });

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
    res.json(mockRecordings);
  });

  app.post("/api/upload", upload.single('recording'), (req, res) => {
    console.log("Simulating delivery of recording to server...");
    res.json({ success: true, message: "Recording delivered and encrypted." });
  });

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
    console.log(`GuardianCalc Server running on http://localhost:${PORT}`);
  });
}

startServer();
