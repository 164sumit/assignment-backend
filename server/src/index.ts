import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import connectDB from './config/database';
import cors from 'cors';  // Add this line to import the CORS middleware

// Connect to the database
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Add CORS middleware
app.use(cors());  // Enable CORS for all routes

app.get("/test", (req, res) => {
    res.json({
        message: "Server working"
    });
});

// Routes
app.use('/api/user', userRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
