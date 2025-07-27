import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  deadline: Date,
  completed: { type: Boolean, default: false },
  documents: [{ filename: String, url: String }],
  assignedDevs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Project', projectSchema);
