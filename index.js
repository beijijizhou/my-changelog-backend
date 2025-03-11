
import express from 'express'; // Default import for Express
import dotenv from 'dotenv';
import { githubRoutes } from './routes/github/githubRoutes.js';
import { commitRoutes } from './routes/commits/routes.js';
import { errorHandler } from './helper/errorHelper.js';
import { corsOption } from './helper/corsHelper.js';
const app = express();
app.use(express.json());
dotenv.config()
app.use(corsOption);

app.use(githubRoutes);
app.use("/commits", commitRoutes);
app.use(errorHandler);
app.get("/", (req, res)=>{
    return res.json({message:"welcome"})
})
app.listen(5000, () => console.log('Backend running on port 5000'));