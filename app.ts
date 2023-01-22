import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import "reflect-metadata";
import yaml from "yamljs";
import { initDatasource } from "./src/config";
import { authMiddleware } from "./src/middleware";
import { usersRouter } from "./src/routes";

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

const swaggerDocument = yaml.load("./src/docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT ?? 3000;

app.get("/", authMiddleware, (req, res) => {
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
