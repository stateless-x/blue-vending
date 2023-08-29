const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const allRoutes = require("./routes/allRoutes");

app.use(cors());
app.use(bodyParser.json());
app.use(allRoutes);

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
