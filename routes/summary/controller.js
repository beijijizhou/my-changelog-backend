import { Summary } from "./model.js";
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

export const getAllSummaries = async (req, res) => {
    try {
        const { owner, repo } = req; // Get owner and repo from the URL params
        // Find the summary document for the given owner and repo
        const summaryDoc = await Summary.findOne({ owner, repo });
        console.log(summaryDoc)
        // Return an empty array if no document is found or if there are no summaries
        const summaries = summaryDoc ? summaryDoc.summaries : [];
        
        return res.status(200).json({ message: summaries.length ? "Summaries found" : "No summaries available for this repository", summaries });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

