// swagger/swaggerConfig.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TourConnect API",
      version: "1.0.0",
      description: "API documentation for the TourConnect backend project",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes.js"], // this points to the file where routes are defined
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
