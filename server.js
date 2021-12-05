const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception! SHUTTING DOEN.... ");
  process.exit(1);
});

const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("Connection successfully with atlas!");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, (err) => {
  if (err) return console.log(err.message);
  console.log(`connected on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDELED REJECTION! SHUTTING DOEN.... ");
  server.close(() => {
    process.exit(1);
  });
});
