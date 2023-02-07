import "reflect-metadata";
import path from "path";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import { initDatasource } from "./config";
import { authMiddleware, sessionModdleware } from "./middleware";
import { usersRouter } from "./routes";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const swaggerDocument = yaml.load("./src/docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT ?? 3000;

app.get("/", authMiddleware, sessionModdleware, (req, res) => {
  res.send("Hello world");
});

app.use("/users", usersRouter);

async function initApp(): Promise<void> {
  await initDatasource();

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  console.log("App is running");
}

initApp().catch((err) => {
  console.log(err);
});
