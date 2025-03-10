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
    req.commitMessages = commitMessages; // Attach commit messages to the request object
    next(); // Pass control to the next middleware or route handler
};


export const summarizeCommitMessages = async (req, res, next) => {
    const { commitMessages } = req;

    if (!commitMessages || commitMessages.length === 0) {
        return res.status(404).json({ error: 'No commit messages available to summarize' });
    }

    const commitMessagesText = commitMessages.join('\n'); // Join messages into a single string

    try {
        const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY; // Replace with your Gemini API key
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

        const response = await axios.post(url, {
            contents: [{
                parts: [{
                    text: `Summarize the following commit messages in html fashion so that I can display it in the website automatically:\n${commitMessagesText}`
                }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        // Attach the summarized commit messages to the request object
        req.commitSummary = response.data.candidates[0].content.parts;
        
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        console.error('Error summarizing commits:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to summarize commits' });
    }
};

export const commitMiddlewares = [fetchCommits, extractCommitMessages, summarizeCommitMessages]