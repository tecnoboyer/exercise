import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  platform: string;
  created_at: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  platform: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
