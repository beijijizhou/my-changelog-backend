
import express from 'express'; // Default import for Express
import dotenv from 'dotenv';
import { githubRoutes } from './routes/github/routes.js';
import { commitRoutes } from './routes/commits/routes.js';
import { errorHandler } from './helper/errorHelper.js';
import { corsOption } from './helper/corsHelper.js';
import { connectDB } from './db/connect.js';
import { ownerAndRepoValidation } from './routes/commits/middleware.js';
dotenv.config()
const app = express();
connectDB();
app.use(express.json());

app.use(corsOption);

app.use(githubRoutes);
app.use("/commits/:owner/:repo", ownerAndRepoValidation, commitRoutes);
app.use(errorHandler);
app.get("/", (req, res) => {
    return res.json({ message: "welcome" })
})
app.listen(5000, () => console.log('Backend running on port 5000'));