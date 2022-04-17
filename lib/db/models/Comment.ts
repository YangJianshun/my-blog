import mongoose, { Document } from 'mongoose';

export interface IComment extends Document {
  id: string;
  articleId: string;
  content: string;
  author: string;
}

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  articleId: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', UserSchema);
