import express from 'express';
import { findSummary } from './middleware.js';
import { saveSummary, getAllSummaries, updateSummary, deleteSummary } from '../summary/controller.js';

const summaryRoutes = express.Router();
summaryRoutes.post('/', saveSummary);
summaryRoutes.get('/', findSummary, getAllSummaries);
summaryRoutes.patch('/:id', findSummary, updateSummary);
summaryRoutes.delete('/:id', findSummary, deleteSummary);
export { summaryRoutes };