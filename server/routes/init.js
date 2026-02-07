import 'dotenv/config';
import express from 'express';
import blogsRouter from './blogs.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));
app.use('/blogs', blogsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
