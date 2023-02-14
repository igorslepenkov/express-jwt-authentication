import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  token: string;
}
