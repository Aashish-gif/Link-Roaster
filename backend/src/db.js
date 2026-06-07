import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DATABASE] Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
}
