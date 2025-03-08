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
   
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error on token: ');
    return res.status(500).send('Error on token');
  }
};

export const fetchRepositories = async (req, res, next) => {
  const { accessToken } = req;

  if (!accessToken) {
    return res.status(500).send('Error: Access token not obtained');
  }

  try {
    const reposResponse = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    

    req.repos = reposResponse.data; // Save repositories to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error on repo:');
    return res.status(500).send('Error on repo');
  }
};