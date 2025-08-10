const express = require('express');
const ytdl = require('@distube/ytdl-core');
const path = require('path');

const app = express();
const PORT = 3000;

// Archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para descargar
app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        const type = req.query.type || 'mp4'; // mp4 o mp3
        const quality = req.query.quality || 'highest';

        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send("URL inválida");
        }

        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

        if (type === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
            ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
            ytdl(videoURL, { quality }).pipe(res);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al procesar la descarga.");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
