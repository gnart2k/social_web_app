const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const app = express();
const port = process.env.PORT || 3001;
const postRouter = require("./routes/post");
//config to access env
dotenv.config();
//connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }, () => {
  console.log("connected to database");
});

//middleware
var cors = require("cors");

// use it before all route definitions
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.json("welcome");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRouter);
app.listen(port, () => {
  console.log(`running in ${port}`);
});
