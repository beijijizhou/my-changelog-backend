// summaryModel.js
import mongoose from "mongoose";
// Define the Summary schema
const summarySchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    trim: true // Removes leading/trailing whitespace
  },
  repo: {
    type: String,
    required: true,
    trim: true
  },
  commitID: {
    type: String,
    required: true,
    trim: true // GitHub SHA is a string
  },
  message: {
    type: String,
    required: true // The commit message
  },
  summary: {
    type: String,
    required: true // The generated summary
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a compound index to ensure owner + repo + commitID is unique
summarySchema.index({ owner: 1, repo: 1, commitID: 1 }, { unique: true });

// Create and export the Summary model
export const Summary = mongoose.model('Summary', summarySchema);

