import mongoose from "mongoose";

// Define the Summary schema
const summarySchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    trim: true
  },
  repo: {
    type: String,
    required: true,
    trim: true
  },
  summaries: [
    {
      commits: [{
        id: {
          type: String,
          required: true,
          trim: true
        },
        message: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          default: Date.now
        }
      }],
      summary: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

// Ensure owner + repo is unique
summarySchema.index({ owner: 1, repo: 1 }, { unique: true });

export const Summary = mongoose.model("Summary", summarySchema);