// src/routes/commits.js

import express from 'express';

import { commitMiddlewares } from './middleware.js';
const commitRoutes = express.Router();

// Commit route
commitRoutes.get('/:owner/:repo', commitMiddlewares, (req, res) => {
    const commitMessages = req.commitMessages;
    const commitSummary = req.commitSummary[0].text;
    const recentCommits = req.recentCommits;
    return res.status(200).json({
        commitMessages,
        commitSummary,
        recentCommits,
    }); // Return the commits from the request object
});

export { commitRoutes };
