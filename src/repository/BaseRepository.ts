import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  UpdateResult,
} from "typeorm";
import { dataSourceManager } from "../config";
import { Repository } from "./Repository";

export class BaseRepository<Type extends ObjectLiteral> extends Repository<Type> {
  public async create(plainObject: DeepPartial<Type>): Promise<Type> {
    const record = dataSourceManager.create(this.entity, plainObject);
    await dataSourceManager.save(record);

    return record;
  }

  public async update(criteria: Partial<Type>, changes: Partial<Type>): Promise<UpdateResult> {
    return await dataSourceManager.update(this.entity, criteria, changes);
  }

  public async find(options?: FindManyOptions<Type>): Promise<Type[]> {
    return await dataSourceManager.find(this.entity, options);
  }

  public async findOneByOtherProps(
    options: FindOptionsWhere<Type> | Array<FindOptionsWhere<Type>>
  ): Promise<Type | null> {
    const record = await dataSourceManager.findOneBy<Type>(this.entity, options);
    return record;
  }

  public async remove<Type>(entity: Type): Promise<Type> {
    return await dataSourceManager.remove<Type>(entity);
  }
}
