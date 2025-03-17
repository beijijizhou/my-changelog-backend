import { Summary } from "./model.js";
export const findSummary = async (req, res, next) => {
    const { owner, repo } = req;
    const summaryDoc = await Summary.findOne({ owner, repo });
    if (!summaryDoc || !summaryDoc.summaries.length) {
        return res.status(200).json({
            message: 'No summaries available for this repository',
            summaries: null,
        });
    }
    req.summaryDoc = summaryDoc
    next();
}