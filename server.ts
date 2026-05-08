import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middleware to parse JSON
  app.use(express.json());

  // Set up Public Data API proxy endpoints
  const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
  const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

  // 1. Get facility list
  app.get("/api/facilities", async (req, res) => {
    try {
      const url = `${API_BASE_URL}/fcltylist/fcltylistcodelist?serviceKey=${SERVICE_KEY}`;
      const response = await axios.get(url, {
        params: {
          numOfRows: req.query.numOfRows || 100,
          pageNo: req.query.pageNo || 1,
          _type: "json"
        }
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("Error fetching facilities:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch facilities" });
    }
  });

  // 2. Get daily water quality
  app.get("/api/quality", async (req, res) => {
    try {
      const url = `${API_BASE_URL}/day/daylist?serviceKey=${SERVICE_KEY}`;
      const response = await axios.get(url, {
        params: {
          loccd: req.query.fcltyMngNo, // The API uses loccd but frontend uses fcltyMngNo
          stDt: req.query.stDt, // start date format: YYYY-MM-DD
          edDt: req.query.edDt, // end date format: YYYY-MM-DD
          numOfRows: req.query.numOfRows || 1000,
          pageNo: req.query.pageNo || 1,
          _type: "json"
        }
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("Error fetching water quality:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch water quality" });
    }
  });

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
