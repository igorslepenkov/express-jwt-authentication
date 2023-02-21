import "reflect-metadata";
import cors from "cors";
import path from "path";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import { authMiddleware, sessionMiddleware } from "./middleware";
import { todosRouter, usersRouter } from "./routes";

const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const swaggerDocument = yaml.load("./src/docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT ?? 3000;

app.get("/", authMiddleware, sessionMiddleware, (req, res) => {
  res.send("Hello world");
});

app.use("/users", usersRouter);
app.use("/todos", todosRouter);

async function initApp(): Promise<void> {
  try {
    app.listen(PORT);
    console.log(`Listening on port ${PORT}`);
    console.log("App is running");
  } catch (err) {
    console.log("Could not load Sessions module");
  }
}

initApp().catch((err) => {
  console.log(err);
});
