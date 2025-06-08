// const dotenv = require("dotenv").config();
require("dotenv").config();
console.log("DB Connection String:", process.env.MONGO_URI); // Verify loading
const express = require("express");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
