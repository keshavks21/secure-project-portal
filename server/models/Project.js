import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  filename: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  deadline: Date,
  completed: { type: Boolean, default: false },
  documents: [documentSchema],
  assignedDevs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Project', projectSchema);
