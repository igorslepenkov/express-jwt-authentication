import { Entity, Column, ObjectIdColumn, Index } from "typeorm";
import { IsEmail, Length, IsNotEmpty, IsString } from "class-validator";

@Entity()
export class User {
  @ObjectIdColumn()
  id: string;

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
