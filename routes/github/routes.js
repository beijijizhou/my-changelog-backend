import express from 'express';
import { githubMiddleware } from './middleware.js';

const githubRoutes = express.Router();

githubRoutes.post('/callback', githubMiddleware, (req, res) => {
  return res.json({ token: req.accessToken, repos: req.repos });
});

export { githubRoutes };