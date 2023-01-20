import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { authMiddleware } from "./src/middleware";
import { usersRouter } from "./src/routes";

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
const PORT = process.env.PORT ?? 3000;

app.get("/", authMiddleware, (req, res) => {
  res.send("Hello world");
});

app.use("/users", usersRouter);

mongoose.set("strictQuery", false);

const initMongoose = async (): Promise<void> => {
  try {
    const mongodbUrl = `${
      process.env.MONGODB_URL ?? "mongodb://127.0.0.1:27017"
    }/authExample`;
    await mongoose.connect(mongodbUrl);

    console.log("Database connected");
  } catch (err: any) {
    console.log(err);
  }
};

async function initApp(): Promise<void> {
  await initMongoose();

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  console.log("App is running");
}

initApp().catch((err) => {
  console.log(err);
});
