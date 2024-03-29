import "reflect-metadata";
import { config } from "dotenv";
import { DataSource } from "typeorm";
import { User, Todo } from "../entities";

config();

export const appDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Todo],
  synchronize: true,
});

export const initDatasource = async (): Promise<void> => {
  try {
    await appDataSource.initialize();
    console.log("Datasource initialized");
  } catch (err) {
    console.log(err);
  }
};

export const dataSourceManager = appDataSource.manager;
