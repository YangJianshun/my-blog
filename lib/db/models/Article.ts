import mongoose, { Document } from 'mongoose';

export interface IArticle extends Document {
  id: string;
  title: string;
  content: string;
  author: string;
  passwd?: string;
  locked: boolean;
}

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  passwd: {type: String, required: false},
  locked: {type: Boolean, required: true}
});

export default mongoose.models.Article || mongoose.model<IArticle>('Article', UserSchema);
