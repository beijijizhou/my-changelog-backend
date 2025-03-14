import express from 'express';
import { githubMiddleware, fetchRepositories, sortReposByLatestCommit } from './middleware.js';

const githubRoutes = express.Router();
let count = 0
githubRoutes.post('/callback', githubMiddleware, (req, res) => {
  return res.json({ token: req.accessToken, repos: req.repos });
});
githubRoutes.get('/repos', fetchRepositories, sortReposByLatestCommit,(req, res) => {
  console.log("repos returns")
  return res.json({ repos: req.repos });
});
export { githubRoutes };