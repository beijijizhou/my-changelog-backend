import express from 'express';
import { fetchAccessToken,fetchRepositories } from './middleware.js';

const githubRoutes = express.Router();

githubRoutes.post('/callback', fetchAccessToken, fetchRepositories, (req, res) => {
  return res.json({ token: req.accessToken, repos: req.repos });
});

export { githubRoutes };