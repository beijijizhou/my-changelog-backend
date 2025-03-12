import axios from "axios";
const fetchCommits = async (req, res, next) => {
    const { owner, repo } = req.params;
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
    console.log(req.params)
    // Check if owner and repo are provided
    if (!owner || !repo) {
        return res.status(400).json({
            error: 'Both owner and repo are required in the URL path (e.g., /:owner/:repo)'
        });
    }
    next();
};

export const commitMiddlewares = [fetchCommits, extractCommitMessages]