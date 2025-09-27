const express=require('express');
const app=express();
app.use(express.json());
const dotenv=require("dotenv").config();
const connectDB = require("./db");
app.use('/api',require('./routes'));

const port=process.env.PORT
 
connectDB().then(() => {
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
});