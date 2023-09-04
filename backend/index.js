console.log("Starting server...");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
const allRoutes = require("./routes/allRoutes");
app.use(bodyParser.json());
app.use(allRoutes);

const API_PORT = process.env.PORT || 3000;
try {
  app.listen(API_PORT, () => {
    console.log(`Server runnin on port: ${API_PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
}
