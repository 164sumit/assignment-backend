// user controller
// backend/controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserInterface, UserModel } from '../models/usermodel';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
const JWT_SECRET = 'your_jwt_secret'; // Change this to a secure secret key

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    console.log(req.body);
    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      todoList: [],
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '5d' });

    // Save token in cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 5 * 24 * 60 * 60 * 1000 }); // 5 days

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear token from cookie
    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract token from request headers or cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      res.status(401).json({ message: 'Token not found' });
      return;
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
      }

      // Get user information from token
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ user });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};







export const addItemToTodoList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user: UserInterface | null = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { task } = req.body;

    user.todoList.push({ task, completed: false });
    await user.save();

    res.status(201).json({ message: 'Item added to todo list successfully', todoList: user.todoList });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTaskFromTodoList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user: UserInterface | null = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const taskIndex = parseInt(req.params.taskIndex);

    if (taskIndex < 0 || taskIndex >= user.todoList.length) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    user.todoList.splice(taskIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Task deleted successfully', todoList: user.todoList });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTaskInTodoList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user: UserInterface | null = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const taskIndex = parseInt(req.params.taskIndex);

    if (taskIndex < 0 || taskIndex >= user.todoList.length) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const { task, completed } = req.body;

    user.todoList[taskIndex] = { task, completed };
    await user.save();

    res.status(200).json({ message: 'Task updated successfully', todoList: user.todoList });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const clearTodoList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user: UserInterface | null = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.todoList = [];
    await user.save();

    res.status(200).json({ message: 'Todo list cleared successfully', todoList: user.todoList });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};