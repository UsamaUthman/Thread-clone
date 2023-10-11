import express from 'express';
import env from 'dotenv';
import connectDB from './db/dbConfig.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import {v2 as cloudinary} from 'cloudinary';


const app = express();

// Load env variables
env.config({ path: './.env' });

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
    }   
);