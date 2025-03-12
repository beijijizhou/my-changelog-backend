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
   
    return res.status(201).json()
}