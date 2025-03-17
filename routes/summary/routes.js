import express from 'express';
import { findSummary } from './middleware.js';
import { saveSummary, getAllSummaries, updateSummary } from '../summary/controller.js';

const summaryRoutes = express.Router();
summaryRoutes.post('/', saveSummary);
summaryRoutes.get('/', findSummary, getAllSummaries);
summaryRoutes.put('/:id', findSummary, updateSummary);

export { summaryRoutes };