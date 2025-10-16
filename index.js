const express = require("express");
const connectDB = require("./db");
const router = require("./routes"); // ✅ Corrected: was './router'
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TourConnect API',
      version: '1.0.0',
      description: 'TourConnect API using native MongoDB (no schema)',
    },
    servers: [
      {
        url: process.env.SERVER_URL || "https://backend-h32q.onrender.com/api-docs"
      },
    ],
  },
  apis: ['./routes.js'], // make sure this path is correct
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);


// ✅ Home Route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend API is running successfully 🚀",
    api_routes: {
      get_all: "/api/tour",
      create: "/api/tour",
      update: "/api/tour/:id",
      delete: "/api/tour/:id",
      docs: "/api-docs"
    }
  });
});


// Only start server in normal mode (not during tests)
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;

  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
       console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  });
}

module.exports = app; // ✅ Needed for testing