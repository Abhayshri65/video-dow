const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.static('public'));

// Download Endpoint
app.get('/download', async (req, res) => {
    try {
        const url = req.query.url;
        const itag = req.query.itag;
        
        if(!ytdl.validateURL(url)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(url, { quality: itag }).pipe(res);

    } catch (error) {
        console.error('Download Error:', error);
        res.status(500).send('Download Failed');
    }
});
