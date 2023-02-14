import { ObjectLiteral } from "typeorm";
import { dataSourceManager } from "../../config";
import { BaseRepository } from "../BaseRepository";

export class PostgresRepository<Type extends ObjectLiteral> extends BaseRepository<Type> {
  public async findOneById(id: string): Promise<Type | null> {
    return await dataSourceManager.findOneById(this.entity, id);
  }
}
