import { initDatasource, dataSourceManager } from "./src/config";
import { MongodbRepository } from "./src/entities/repositories";
import { User } from "./src/entities";
import { ObjectID } from "mongodb";

const asyncWork = async () => {
  await initDatasource();

  const userRepo = new MongodbRepository(User);

  // const user = await userRepo.create({
  //   firstName: "Igor",
  //   lastName: "Slepenkov",
  //   email: "slepenkov.nii@yandex.by",
  //   password: "Slepenkov2",
  // });
  // console.log(typeof user.id);

  const userId = ObjectID.createFromHexString("63ce88dae6be963d480644ec");
  const allUsers = await dataSourceManager.find(User);

  console.log(userId);
  console.log(allUsers[0].id);

  const userFind = await dataSourceManager.findOneById(User, userId);
  console.log(userFind);
};

asyncWork();
