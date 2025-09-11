const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Ensure uploads directory exists (absolute path)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Proper CORS Configuration
const allowedOrigins = [
  "https://erp.xpert-safety.com", // production frontend
  "http://localhost:3000"         // local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (use ONE static mount with absolute path)
app.use('/uploads', express.static(uploadsDir));

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const projectInitiationRoutes = require('./routes/projectInitiationRoutes');
const centerRoutes = require('./routes/centerRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const batchDetailsRoutes = require('./routes/batchDetailsRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const ojtRoutes = require("./routes/ojtRoutes");
const placementRoutes = require("./routes/placementRoutes");
const welcomeKitRoutes = require("./routes/welcomeKitRoutes");
const internalAssessmentRoutes = require('./routes/internalAssessmentRoutes');
const externalAssessmentRoutes = require('./routes/externalAssessmentRoutes');
const trainerAttendanceRoutes = require("./routes/trainerAttendanceRoutes");
const traineeAttendanceRoutes = require("./routes/traineeAttendanceRoutes");
const certificateDistributionRoutes = require("./routes/certificateDistributionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require("./routes/emailRoutes");
const dropoutRoutes = require("./routes/dropouts");

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/projectInitiation', projectInitiationRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/batch-details', batchDetailsRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use("/api/ojt", ojtRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/welcome-kit", welcomeKitRoutes);
app.use('/api/internal-assessment', internalAssessmentRoutes);
app.use('/api/external-assessment', externalAssessmentRoutes);
app.use("/api/trainer-attendance", trainerAttendanceRoutes);
app.use("/api/trainee-attendance", traineeAttendanceRoutes);
app.use("/api/certificate-distribution", certificateDistributionRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use("/api/email", emailRoutes);
app.use('/api/dropouts', dropoutRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('ERP backend connected to MongoDB Atlas');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
