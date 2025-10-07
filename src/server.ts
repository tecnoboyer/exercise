// src/server.ts
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { connectDB } from './config/index'; // adjust path as needed
import socketService from './services/socket.service';

// Use port 8050 (or from env)
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8050;

(async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Create HTTP server from Express app
    const httpServer = createServer(app);

    // Initialize Socket.IO with permissive CORS for dev
    const io = new Server(httpServer, {
      cors: {
        origin: "*", // Allow all origins in development
        methods: ["GET", "POST"],
        credentials: false
      },
      // Optional: enable transports for older browsers
      transports: ["websocket", "polling"]
    });

    // Make io available to routes (if needed)
    app.locals.io = io;

    // Initialize your socket service
    socketService.initialize(io);

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`🚀 HTTP server running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO server ready on ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();