const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({
  origin: '*', // Allows requests from Vite dev server, localhost, or deployed domains
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Public Static Files (Admin Dashboard UI)
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
      <h1 style="font-size: 2.5rem; letter-spacing: 2px;">HARSH PORTFOLIO BACKEND API</h1>
      <p style="color: #a1a1aa;">Status: <span style="color: #4ade80; font-weight: bold;">ONLINE</span></p>
      <div style="margin: 20px 0;">
        <a href="/admin" style="background: #a855f7; color: #fff; padding: 10px 24px; border-radius: 99px; text-decoration: none; font-weight: bold;">Open Admin Dashboard Web UI</a>
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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 HARSH PORTFOLIO BACKEND SERVER IS RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`💻 ADMIN DASHBOARD WEB UI: http://localhost:${PORT}/admin`);
  console.log(`📥 INQUIRIES API: http://localhost:${PORT}/api/inquiries`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log(`=======================================================`);
});
