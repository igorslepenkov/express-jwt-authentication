import { User } from "../../entities";
import { PostgresRepository } from "./PostgresRepository";

export class UsersRepository extends PostgresRepository<User> {
  constructor() {
    super(User);
  }
}

export const usersRepository = new UsersRepository();
