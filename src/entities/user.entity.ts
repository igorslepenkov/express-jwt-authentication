import { Entity, Column, ObjectIdColumn, Index } from "typeorm";
import { IsEmail, Length, IsNotEmpty, IsString } from "class-validator";
import { ObjectID } from "mongodb";

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  @Index({ unique: true })
  email: string;

  @Column()
  @IsString()
  @Length(6)
  password: string;
}
