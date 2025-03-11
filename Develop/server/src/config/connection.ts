import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';
    
    // Only apply TLS options when connecting to Atlas
    const options = uri.includes('mongodb+srv') ? {
      ssl: true,
      tls: true,
      tlsAllowInvalidHostnames: false
    } : {};
    
    await mongoose.connect(uri, options);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Execute connection
connectDB();

export default mongoose.connection;