require('dotenv').config();
require('express-async-errors');
import { Request, Response } from "express";
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middleware/errorHandler';
import { logger, logEvents } from './middleware/logger';

import corsOptions from './config/corsOption';
import connectDB from './config/dbConn';

import rootRoute from './routes/root';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';

const app = express();

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', rootRoute);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);

app.all('*', (req: Request, res: Response) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
});

mongoose.connection.on('error', (err: any) => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
});