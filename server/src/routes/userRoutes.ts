import express from 'express';
import { signUp, login, logout, getUser, addItemToTodoList, deleteTaskFromTodoList, updateTaskInTodoList, clearTodoList } from '../controller/userController';
import authMiddleware from '../middleware/auth';
// import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// User routes
router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/user', authMiddleware, getUser);
router.post('/todo/add', authMiddleware, addItemToTodoList);
router.delete('/todo/delete/:taskIndex', authMiddleware, deleteTaskFromTodoList);
router.put('/todo/update/:taskIndex', authMiddleware, updateTaskInTodoList);
router.post('/todo/clear', authMiddleware, clearTodoList);

export default router;
