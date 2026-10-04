import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ownership is required for repository'],
      index: true
    },
    githubUrl: {
      type: String,
      required: [true, 'GitHub URL is required'],
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Repository owner is required']
    },
    name: {
      type: String,
      required: [true, 'Repository name is required'],
      trim: true
    },
    fullName: {
      type: String,
      required: [true, 'Repository full name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    defaultBranch: {
      type: String,
      default: 'main'
    },
    stars: {
      type: Number,
      default: 0
    },
    forks: {
      type: Number,
      default: 0
    },
    openIssues: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: ''
    },
    languages: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    topics: {
      type: [String],
      default: []
    },
    license: {
      type: String,
      default: ''
    },
    readme: {
      type: String,
      default: ''
    },
    fileStructure: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    githubData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    analyzedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure uniqueness of a repository per user
repositorySchema.index({ user: 1, githubUrl: 1 });

const Repository = mongoose.models.Repository || mongoose.model('Repository', repositorySchema);

export default Repository;
