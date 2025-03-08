
import express from 'express'; // Default import for Express
import dotenv from 'dotenv';
import { githubRoutes } from './routes/github/githubRoutes.js';
const app = express();
app.use(express.json());
dotenv.config()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(githubRoutes)
// app.use(githubRoutes);
app.listen(5000, () => console.log('Backend running on port 5000'));