// src/routes/commits.js

import express from 'express';

import { commitMiddlewares  } from './middleware.js';
const commitRoutes = express.Router();

// Commit route
commitRoutes.get('/:owner/:repo', commitMiddlewares, (req, res) => {
    res.json(req.commits); // Return the commits from the request object
});

export { commitRoutes };
