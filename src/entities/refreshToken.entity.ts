import { Entity, Column, ObjectIdColumn } from "typeorm";
import { ObjectID } from "mongodb";

@Entity()
export class RefreshToken {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  token: string;
}
