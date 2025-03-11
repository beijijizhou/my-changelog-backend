export const getAllCommits = (req, res) => {
    const commitMessages = req.commitMessages;
    const recentCommits = req.recentCommits;
    return res.status(200).json({
        commitMessages,
        recentCommits,
    });
}
export const getCommitSummary = async (req, res) => {
    const summary = req.commitSummary
    return res.status(200).json({
        summary
    });
};