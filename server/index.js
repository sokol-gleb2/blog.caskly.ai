console.log('SERVER HIT', new Date().toISOString());

import 'dotenv/config';
import express from 'express';
import blogsRouter from './routes/blogs.js';

const app = express();

app.use(express.json({ limit: '2mb' }));

// Only enable CORS locally
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }
        next();
    });
}

app.use('/blogs', blogsRouter);

// Local dev only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

// ALWAYS export app for Vercel
export default app;