import { Summary } from "./model.js";
export const saveSummary = async (req, res) => {
  try {
    // Assume owner and repo come from req.params (adjust as needed)
    const { owner, repo } = req; // Or req.body, depending on your route
    const { commits, summary } = req.body;

    // Validate input
    if (!commits || !summary) {
      return res.status(400).json({ error: "Missing commit or summary" });
    }
    // Find the summary document for the given owner/repo
    let summaryDoc = await Summary.findOne({ owner, repo });

    if (!summaryDoc) {
      // Create a new document if it doesn't exist
      summaryDoc = new Summary({
        owner,
        repo,
        summaries: [{ commits, summary }]
      });
    } else {
      summaryDoc.summaries.push({ commits, summary });
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
  const { summaryDoc } = req;
  return res.status(200).json({
    message: 'Summaries found',
    summaries: summaryDoc.summaries,
  });

};

export const updateSummary = async (req, res) => {
  const { id } = req.params;
  const { summaryDoc } = req;
  const { summary, commits } = req.body;
  const summaryToUpdate = summaryDoc.summaries.id(id);
  if (summary) summaryToUpdate.summary = summary;
  if (commits) summaryToUpdate.commits = commits;

  // Save the document
  try {
    const updatedDoc = await summaryDoc.save();
    return res.status(200).json({
      message: "Summary updated successfully",
      updatedDocument: updatedDoc, // Return the entire updated document
    });
  } catch (error) {
    console.error("Error updating summary:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

