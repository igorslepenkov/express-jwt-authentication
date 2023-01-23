import { EntityTarget, ObjectLiteral } from "typeorm";
import { MongodbRepository } from "../entities/repositories";

export class BaseService<Type extends ObjectLiteral> {
  protected readonly repository: MongodbRepository<Type>;
  constructor(typeormEntity: EntityTarget<Type>) {
    this.repository = new MongodbRepository(typeormEntity);
  }
}
