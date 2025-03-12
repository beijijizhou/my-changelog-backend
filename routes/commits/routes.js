import express from 'express';
import { commitMiddlewares, summarizeCommitMessages, ownerAndRepoValidation } from './middleware.js';
import { getAllCommits, getCommitSummary, saveSummary } from './controller.js';
const commitRoutes = express.Router();
commitRoutes.use('/:owner/:repo', ownerAndRepoValidation);
commitRoutes.get('/:owner/:repo', commitMiddlewares, getAllCommits);
commitRoutes.post('/:owner/:repo',  saveSummary);
commitRoutes.get('/:owner/:repo/summary', summarizeCommitMessages, getCommitSummary)
export { commitRoutes };
