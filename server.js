const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 CORS para desarrollo y producción
app.use(cors({
  origin: [
    "http://localhost:8100",          // Ionic en desarrollo
    "https://vdownload.onrender.com" // Cambia por tu dominio final si tienes
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// 🔹 Función para limpiar la URL de YouTube
function sanitizeYouTubeUrl(url) {
  try {
    const match = url.match(/v=([^&]+)/);
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : url;
  } catch {
    return url;
  }
}

// 🔹 Endpoint para descargar
app.get("/download", async (req, res) => {
  try {
    let { url, type, quality } = req.query;

    if (!url) {
      return res.status(400).send("❌ URL de YouTube requerida");
    }

    url = sanitizeYouTubeUrl(url);
    console.log("📥 Descargando video:", url);

    res.header("Content-Disposition", `attachment; filename="video.${type}"`);

    ytdl(url, {
      filter: format => format.container === type,
      quality: quality || "highest"
    })
    .on("error", err => {
      console.error("⚠️ Error en la descarga:", err);
      res.status(500).send("Error en la descarga del video");
    })
    .pipe(res);

  } catch (err) {
    console.error("🔥 Error general:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// 🔹 Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
