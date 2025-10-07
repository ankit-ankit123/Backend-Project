const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tour Management API",
      version: "1.0.0",
      description: "API documentation for Tour Management System",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes.js"], // Path to your documented routes
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
