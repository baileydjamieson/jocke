import { promisifyStore, expressSession } from 'next-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

const session = expressSession({
  secret: process.env.SESSION_SECRET || 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax',
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
  }),
});

export default promisifyStore(session);
