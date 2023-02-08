import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, RefreshToken } from "../entities";

export const appDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
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
