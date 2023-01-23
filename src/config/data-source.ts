import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, RefreshToken } from "../entities";

export const appDataSource = new DataSource({
  type: "mongodb",
  host: "localhost",
  url: process.env.MONGODB_URL ?? "mongodb://127.0.0.1:27017",
  useNewUrlParser: true,
  database: "authExample",
  entities: [User, RefreshToken],
  synchronize: true,
});

export const initDatasource = async () => {
  try {
    await appDataSource.initialize();
    console.log("Datasource initialized");
  } catch (err) {
    console.log(err);
  }
};

export const dataSourceManager = appDataSource.manager;
