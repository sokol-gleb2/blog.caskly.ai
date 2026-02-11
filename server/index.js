import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import blogsRouter from './routes/blogs.js';

const app = express();

app.use(express.json({ limit: '2mb' }));

app.use(cors({
    origin: "https://blog.caskly.ai",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
}));

// Explicit preflight handling (important for Vercel)
// app.options("*", cors());

app.use('/blogs', blogsRouter);

app.get('/health', (req, res) => {
    res.json({ ok: true });
});

// Local dev only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

export default app;