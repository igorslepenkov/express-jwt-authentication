import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity()
export class RefreshToken {
  @ObjectIdColumn()
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  token: string;
}
