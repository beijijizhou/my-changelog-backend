
import express from 'express'; // Default import for Express
import dotenv from 'dotenv';
import { githubRoutes } from './routes/github/githubRoutes.js';
import { commitRoutes } from './routes/commits/commitRoutes.js';
import { errorHandler } from './helper/errorHelper.js';
const app = express();
app.use(express.json());
dotenv.config()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', ['http://localhost:5173','https://my-changelog-app.vercel.app']);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(githubRoutes);
app.use("/commits", commitRoutes);
app.use(errorHandler);
app.get("/", (req, res)=>{
    return res.json({message:"welcome"})
})
app.listen(5000, () => console.log('Backend running on port 5000'));