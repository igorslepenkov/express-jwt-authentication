import { RefreshToken } from "../../entities";
import { MongodbRepository } from "./MongodbRepository";

export class RefreshTokensRepository extends MongodbRepository<RefreshToken> {
  constructor() {
    super(RefreshToken);
  }
}

export const refreshTokensRepository = new RefreshTokensRepository();
