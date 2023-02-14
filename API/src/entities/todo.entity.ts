import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";
import { User } from "./user.entity";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  description: string;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
