// const mongoose = require('mongoose')
import mongoose from 'mongoose';
import { DATABASE_URL, MONGODB_CONNECTION_STRING } from '../constants';

export const connectDatabase = async () => {
  // mongoose.connect(MONGODB_CONNECTION_STRING)
  mongoose
    .connect(DATABASE_URL)
    .then((event) => console.log('MongoDB Connected', event.connection.host))
    .catch((err) => console.log('MongoDB Connection Error:', err));
};
