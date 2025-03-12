import express from 'express';

import { saveSummary,getAllSummaries } from '../summary/controller.js';
const summaryRoutes = express.Router();
summaryRoutes.post('/', saveSummary);
summaryRoutes.get('/', getAllSummaries);
export { summaryRoutes };