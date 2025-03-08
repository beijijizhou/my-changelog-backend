// src/utils/github.js

import axios from "axios";
const fetchCommits = async (req, res, next) => {
    const { owner, repo } = req.params;
    const githubToken = req.headers.authorization || ''; // Assuming the token is passed in the Authorization header
    if (!githubToken) {
        return res.status(401).json({ error: 'Unauthorized, no token available' });
    }
    console.log(owner, repo, githubToken)
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits`,
            {
                headers: {
                    Authorization: githubToken,
                },
            }
        );
        req.commits = response.data; // Attach commits to the request object
        next(); // Pass control to the next middleware or route handler
    } catch (err) {
        console.error('Error fetching commits:');
        return res.status(500).json({ error: 'Failed to fetch commits from GitHub' });
    }
};
// middleware/extractCommitMessages.js
const extractCommitMessages = (req, res, next) => {
    const { commits } = req;

    if (!commits || commits.length === 0) {
        return res.status(404).json({ error: 'No commits found' });
    }

    // Extract commit messages
    const commitMessages = commits.map(commit => commit.commit.message);
    console.log(commitMessages)
    req.commitMessages = commitMessages; // Attach commit messages to the request object
    next(); // Pass control to the next middleware or route handler
};


export const commitMiddlewares = [fetchCommits, extractCommitMessages]