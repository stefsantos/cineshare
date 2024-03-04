import express from 'express';
import dotenv from 'dotenv';
import connectdb from './db/connectdb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectdb();

const app = express();  

const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


//Routes
app.use('/api/users', userRoutes);



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


