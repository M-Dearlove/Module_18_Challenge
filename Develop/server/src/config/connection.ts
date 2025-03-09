import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';
    
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: uri.includes('mongodb+srv'),
      tlsAllowInvalidHostnames: false,
      retryWrites: true
    };
    
    await mongoose.connect(uri, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Execute connection
connectDB();

export default mongoose.connection;