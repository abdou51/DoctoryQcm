const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
require("dotenv").config();

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "doctoryqcm",
  })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

// // Define routes
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const courseRoutes = require("./routes/courseRoutes");
const questionRoutes = require("./routes/questionRoutes");
const noteRoutes = require("./routes/noteRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const signalRoutes = require("./routes/signalRoutes");
const answerRoutes = require("./routes/answerRoutes");
const statsRoutes = require("./routes/statsRoutes");

const api = process.env.API_URL;

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/modules", moduleRoutes);
app.use("/courses", courseRoutes);
app.use("/questions", questionRoutes);
app.use("/notes", noteRoutes);
app.use("/favourites", favouriteRoutes);
app.use("/signals", signalRoutes);
app.use("/answers", answerRoutes);
app.use("/stats", statsRoutes);
// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status).json({ message: err });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
