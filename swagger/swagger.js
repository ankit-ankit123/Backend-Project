const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TourConnect API',
      version: '1.0.0',
      description: 'TourConnect API using native MongoDB (no schema)',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',  // make sure this matches your actual route prefix
      },
    ],
  },
  apis: ['./routes.js'],  // make sure this path is correct relative to swagger.js file!
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
