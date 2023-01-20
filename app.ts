import express from "express";
import morgan from "morgan";
import { initMongoose } from "./src/config";
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
