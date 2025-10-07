const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger"); //  fixed path
const routes = require("./routes");

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", routes);

mongoose
  .connect("mongodb://localhost:27017/tourDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" Connected to MongoDB");
    app.listen(3000, () => {
      console.log(" Server is running on http://localhost:3000");
      console.log("Swagger docs at http://localhost:3000/api-docs");
    });
  })
  .catch((err) => console.error(" MongoDB connection failed:", err));
