import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  UpdateResult,
  EntityTarget,
} from "typeorm";
import { ObjectID } from "mongodb";
import { dataSourceManager } from "../../config";

export class MongodbRepository<Type extends ObjectLiteral> {
  entity: EntityTarget<Type>;
  constructor(typeormEntity: EntityTarget<Type>) {
    this.entity = typeormEntity;
  }

  async create(plainObject: DeepPartial<Type>): Promise<Type> {
    const record = dataSourceManager.create(this.entity, plainObject);
    await dataSourceManager.save(record);

    return record;
  }

  async update(criteria: Partial<Type>, changes: Partial<Type>): Promise<UpdateResult> {
    return await dataSourceManager.update(this.entity, criteria, changes);
  }

  async find(options?: FindManyOptions<Type>): Promise<Type[]> {
    return await dataSourceManager.find(this.entity, options);
  }

  async findOneByOtherProps(
    options: FindOptionsWhere<Type> | Array<FindOptionsWhere<Type>>
  ): Promise<Type | null> {
    const record = await dataSourceManager.findOneBy<Type>(this.entity, options);
    return record;
  }

  async findOneById(id: string): Promise<Type | null> {
    return await dataSourceManager.findOneById(this.entity, ObjectID.createFromHexString(id));
  }

  async remove<Type>(entity: Type): Promise<Type> {
    return await dataSourceManager.remove<Type>(entity);
  }
}
