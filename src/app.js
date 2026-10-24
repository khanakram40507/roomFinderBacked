
const express = require("express");
const cors = require("cors");


const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RoomFinder API is running",
  });
});

app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
