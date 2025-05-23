import axios from "axios";
import { Summary } from "../summary/model.js";
const getLatestCommitDate = async (req, res, next) => {
    const { owner, repo } = req;
    const DELAY_TIME = 1000;
    try {
        const summaryDoc = await Summary.findOne({ owner, repo });

        if (!summaryDoc || summaryDoc.summaries.length === 0) {
            req.latestCommitDate = undefined; // No summaries found
            return next();
        }
        const lastCommit = summaryDoc.summaries[summaryDoc.summaries.length - 1].commits
        const latestCommitDate = new Date(lastCommit[0].date);
        const adjustedDate = new Date(latestCommitDate.getTime() + DELAY_TIME);
        req.latestCommitDate = adjustedDate.toISOString(); 
        next();
    } catch (err) {
        console.error('Error finding latest commit date:', err);
        return res.status(500).json({ error: 'Failed to retrieve latest commit date' });
    }
};
const fetchCommits = async (req, res, next) => {
    const { owner, repo } = req;
    const githubToken = req.headers.authorization || '';
    if (!githubToken) {
        return res.status(401).json({ error: 'Unauthorized, no token available' });
    }
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits`,
            {
                headers: {
                    Authorization: githubToken,
                },
                params: {
                    since: req.latestCommitDate, // Fetch commits after this date
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
        
        return res.status(200).json({ commitMessages: null });
    }
    const commitMessages = commits.map(commit => ({
        id: commit.sha,
        message: commit.commit.message,
        date: commit.commit.author.date, // Extract the commit date
    }));
    req.commitMessages = commitMessages; // Attach commit messages to the request object
    next(); // Pass control to the next middleware or route handler
};


export const summarizeCommitMessages = async (req, res, next) => {
    let { commitMessages } = req.body;
    if (!commitMessages || commitMessages.length === 0) {
        return res.status(404).json({ error: 'No commit messages available to summarize' });
    }
    commitMessages = commitMessages.map(commit => commit.message);
    const commitMessagesText = commitMessages.join('\n'); // Join messages into a single string
    try {
        const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY; // Replace with your Gemini API key
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const prompt = `Summarize the following commit messages in HTML format for React-Quill display. Use <h2> for section titles and <ul><li> for listing important changes. Return only the raw HTML, No backticks!!:\n${commitMessagesText}`;
        const response = await axios.post(url, {
            contents: [{
                parts: [{
                    text: prompt,
                }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        // Attach the summarized commit messages to the request object
        req.commitSummary = response.data.candidates[0].content.parts[0].text;

        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        console.error('Error summarizing commits:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to summarize commits' });
    }
};
export const ownerAndRepoValidation = (req, res, next) => {
    const { owner, repo } = req.params;
    if (!owner || !repo) {
        return res.status(400).json({
            error: 'Both owner and repo are required in the URL path (e.g., /:owner/:repo)'
        });
    }
    req.owner = owner;
    req.repo = repo;
    next();
};

export const commitMiddlewares = [getLatestCommitDate, fetchCommits, extractCommitMessages]