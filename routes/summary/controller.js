import { Summary } from "./model.js";
export const saveSummary = async (req, res) => {
    try {
      // Assume owner and repo come from req.params (adjust as needed)
      const { owner, repo } = req; // Or req.body, depending on your route
      const { commit, summary } = req.body;
  
      // Validate input
      if (!commit || !summary) {
        return res.status(400).json({ error: "Missing commit or summary" });
      }
      if (!commit.id || !commit.message || !commit.date) {
        return res.status(400).json({ error: "Commit must include id, message, and date" });
      }
  
      // Find the summary document for the given owner/repo
      let summaryDoc = await Summary.findOne({ owner, repo });
  
      if (!summaryDoc) {
        // Create a new document if it doesn't exist
        summaryDoc = new Summary({
          owner,
          repo,
          summaries: [{ commit, summary }]
        });
      } else {
        summaryDoc.summaries.push({ commit, summary });
      }
      const savedDoc = await summaryDoc.save();
      return res.status(201).json({
        message: "Summary saved successfully",
        data: savedDoc.summaries[savedDoc.summaries.length - 1] // Return the new entry
      });
    } catch (error) {
      console.error(error); // Log error for debugging
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

