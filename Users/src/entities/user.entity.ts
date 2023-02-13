import { Entity, Column, Index, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { IsEmail, Length, IsNotEmpty, IsString } from "class-validator";
import { Todo } from "./todo.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
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

  @OneToOne(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
