// middleware/githubAccessToken.js
import axios from 'axios';

// Middleware to fetch GitHub access token
export const fetchAccessToken = async (req, res, next) => {
  const { code } = req.body;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!code) {
    return res.status(400).send('Error: Code is missing');
  }
  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    req.accessToken = response.data.access_token;
    console.log(req.accessToken)
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error on token: ');
    return res.status(500).send('Error on token');
  }
};


export const fetchRepositories = async (req, res, next) => {
  let { accessToken } = req;
  const authorizationHeader = req.headers.authorization;

  if (!accessToken) {
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        console.error('Invalid Authorization header:', authorizationHeader);
        return res.status(400).json({ error: 'Invalid Authorization header' });
      }
      accessToken = token;
    } else {
      console.error('No access token or Authorization header provided');
      return res.status(401).json({ error: 'Unauthorized: Access token not provided' });
    }
  }

  try {
    const reposResponse = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    req.repos = reposResponse.data;
    next();
  } catch (error) {
    console.error('Error fetching repositories from GitHub:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return res.status(500).json({
      error: 'Failed to fetch repositories from GitHub',
      details: error.response?.data || error.message,
    });
  }
};
export const sortReposByLatestCommit = (req, res, next) => {
  try {
    const repos = req.repos; // Get the repos from the previous middleware

    // Sort the repositories based on the updated_at field
    repos.sort((a, b) => {
      const updatedAtA = a.updated_at ? new Date(a.updated_at) : null;
      const updatedAtB = b.updated_at ? new Date(b.updated_at) : null;

      // Sort by the updated_at date (latest first)
      if (!updatedAtA) return 1; // If A has no updated_at, put it last
      if (!updatedAtB) return -1; // If B has no updated_at, put it last
      return updatedAtB - updatedAtA; // Sort descending (latest first)
    });

    // Save sorted repositories to the request object
    req.repos = repos;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error sorting repos:', error);
    return res.status(500).send('Error sorting repositories');
  }
};


export const githubMiddleware = [fetchAccessToken, fetchRepositories, sortReposByLatestCommit]