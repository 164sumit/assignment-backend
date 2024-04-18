// backend/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define TodoItem interface
export interface TodoItem {
  task: string;
  completed: boolean;
}

// Define User interface
export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  todoList: TodoItem[];
}

// Define UserSchema
const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  todoList: [{ task: { type: String, required: true }, completed: { type: Boolean, default: false } }],
});

// Define and export UserModel based on UserSchema
export const UserModel = mongoose.model<UserInterface>('User', UserSchema);