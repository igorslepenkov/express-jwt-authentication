import { initDatasource, dataSourceManager } from "./src/config";
import { User } from "./src/entities";

const startNewLifeWithTypeorm = async () => {
  try {
    await initDatasource();

    const users = await dataSourceManager.find(User);
    console.log(users);

    const user = new User();
    user.firstName = "Igor";
    user.lastName = "Slepenkov";
    user.email = "slepenkov.nii@yandex.by";
    user.password = "Slepenkov2";

    const result = await dataSourceManager.save(user);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

startNewLifeWithTypeorm();
