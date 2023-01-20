import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export const initMongoose = async (): Promise<void> => {
  try {
    const mongodbUrl = `${process.env.MONGODB_URL ?? "mongodb://127.0.0.1:27017"}/authExample`;
    await mongoose.connect(mongodbUrl);

    console.log("Database connected");
  } catch (err: any) {
    console.log(err);
  }
};
