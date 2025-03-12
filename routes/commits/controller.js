import { Summary } from "./model.js";
export const getAllCommits = (req, res) => {
    const commitMessages = req.commitMessages;
    return res.status(200).json({
        commitMessages,
    });
}
export const getCommitSummary = async (req, res) => {
    const summary = req.commitSummary
    return res.status(200).json({
        summary
    });
};

export const saveSummary = async (req, res) => {
    try {
        const { owner, repo } = req;
        const { commitID, message, summary } = req.body;

        if (!commitID || !message || !summary) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Find the summary document for the given owner/repo
        let summaryDoc = await Summary.findOne({ owner, repo });

        if (!summaryDoc) {
            // Create a new document if it doesn't exist
            summaryDoc = new Summary({
                owner,
                repo,
                summaries: [{ commitID, message, summary }]
            });
        } else {
            // Append new commit to the commits array
            summaryDoc.summaries.push({ commitID, message, summary });
        }

        // Save the document
        await summaryDoc.save();

        return res.status(201).json({ message: "Summary saved successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
