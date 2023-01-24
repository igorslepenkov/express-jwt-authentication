import { User } from "../../entities";
import { MongodbRepository } from "./MongodbRepository";

export class UsersRepository extends MongodbRepository<User> {
  constructor() {
    super(User);
  }
}

export const usersRepository = new UsersRepository();
