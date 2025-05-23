import express from 'express';
import { commitMiddlewares, summarizeCommitMessages } from './middleware.js';
import { getAllCommits, getCommitSummary } from './controller.js';
const commitRoutes = express.Router();
commitRoutes.get('/', commitMiddlewares, getAllCommits);
commitRoutes.post('/summary', summarizeCommitMessages, getCommitSummary);
export { commitRoutes };
