const mongoose = require("mongoose");
const Category = require("./models/category");
const Module = require("./models/module");
const Course = require("./models/course");
const Question = require("./models/question");

const fs = require("fs");
const path = require("path");

// Replace 'your_database_connection_string' with your actual MongoDB connection string
const dbConnectionString = "mongodb://localhost:27017/";

mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "doctoryQcm",
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB successfully!");

  const filePath = path.join(__dirname, "MEDICALE.json");
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  console.log(jsonData);

  async function insertData(jsonData) {
    try {
      for (const categoryIndex in jsonData) {
        const categoryData = jsonData[categoryIndex];
        const category = await Category.create({ name: categoryData.name });

        for (const moduleIndex in categoryData.modules) {
          const moduleData = categoryData.modules[moduleIndex];
          const module = await Module.create({
            name: moduleData.name,
            category: category._id,
          });

          for (const courseIndex in moduleData.courses) {
            const courseData = moduleData.courses[courseIndex];
            const course = await Course.create({
              name: courseData.name,
              module: module._id,
            });

            for (const questionIndex in courseData.questions) {
              const questionData = courseData.questions[questionIndex];
              try {
                const question = await Question.create({
                  category: category._id,
                  module: module._id,
                  course: course._id,
                  text: questionData.text,
                  choices: questionData.choices,
                  correctAnswers: questionData.correctAnswers,
                });

                // You can use the 'question' object if needed, e.g., for logging.
              } catch (error) {
                console.error(
                  `Error inserting question at line ${
                    parseInt(categoryIndex) + 1
                  }.${parseInt(moduleIndex) + 1}.${parseInt(courseIndex) + 1}.${
                    parseInt(questionIndex) + 1
                  }: ${error.message}`
                );
                console.error("Offending question data:", questionData);

                // Stop processing and throw the error
                throw error;
              }
            }
          }
        }
      }

      console.log("Data inserted successfully!");
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }

  // Call the function to insert data
  insertData(jsonData);
});
