import {
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  UpdateResult,
} from "typeorm";

export abstract class Repository<Type extends ObjectLiteral> {
  entity: EntityTarget<Type>;
  constructor(typeormEntity: EntityTarget<Type>) {
    this.entity = typeormEntity;
  }

  public abstract create(plainObject: DeepPartial<Type>): Promise<Type>;

  public abstract update(criteria: Partial<Type>, changes: Partial<Type>): Promise<UpdateResult>;

  public abstract find(options?: FindManyOptions<Type>): Promise<Type[]>;

  public abstract findOneByOtherProps(
    options: FindOptionsWhere<Type> | Array<FindOptionsWhere<Type>>
  ): Promise<Type | null>;

  public abstract remove<Type>(entity: Type): Promise<Type>;
}
