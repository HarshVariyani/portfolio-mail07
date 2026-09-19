const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO Real-Time WebSockets Engine
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
  }
});

const PORT = process.env.PORT || 5000;

// Attach Socket.IO instance to app for controllers
app.set('io', io);

// Middleware Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Public Static Files (Admin Dashboard UI & Socket.IO Client)
app.use(express.static(path.join(__dirname, 'public')));

// Attach API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Admin Dashboard Route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #050507; color: #fff;">
      <h1 style="font-size: 2.5rem; letter-spacing: 2px;">HARSH PORTFOLIO BACKEND API & WEBSOCKETS SERVER</h1>
      <p style="color: #a1a1aa;">Status: <span style="color: #4ade80; font-weight: bold;">ONLINE</span> | Real-Time Engine: <span style="color: #a855f7; font-weight: bold;">SOCKET.IO WEBSOCKETS</span></p>
      <div style="margin: 25px 0;">
        <a href="/admin" style="background: #a855f7; color: #fff; padding: 12px 28px; border-radius: 99px; text-decoration: none; font-weight: bold;">Open Real-Time Admin Dashboard Web UI</a>
      </div>
      <p style="color: #71717a;">Available API Endpoints: 
        <a href="/api/health" style="color: #60a5fa;">/api/health</a>, 
        <a href="/api/inquiries" style="color: #60a5fa;">/api/inquiries</a>, 
        <a href="/api/services" style="color: #60a5fa;">/api/services</a>, 
        <a href="/api/portfolio" style="color: #60a5fa;">/api/portfolio</a>
      </p>
    </div>
  `);
});

// Real-time Socket.IO Connection Manager
let activeConnectedClients = 0;

io.on('connection', (socket) => {
  activeConnectedClients++;
  console.log(`⚡ [WebSocket] Client Connected: ${socket.id} | Total Online: ${activeConnectedClients}`);

  // Broadcast updated online count to all admin dashboards
  io.emit('online:count', activeConnectedClients);

  socket.on('disconnect', () => {
    activeConnectedClients = Math.max(0, activeConnectedClients - 1);
    console.log(`🔌 [WebSocket] Client Disconnected: ${socket.id} | Total Online: ${activeConnectedClients}`);
    io.emit('online:count', activeConnectedClients);
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.'
  });
});

// Start HTTP & WebSockets Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 HARSH PORTFOLIO BACKEND & WEBSOCKETS SERVER RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`⚡ WEBSOCKET ENGINE: ACTIVE (Socket.IO v4)`);
  console.log(`💻 REAL-TIME ADMIN DASHBOARD: http://localhost:${PORT}/admin`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log(`=======================================================`);
});
