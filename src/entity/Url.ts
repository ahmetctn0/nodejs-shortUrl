import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    originalUrl!: string;

    @Column({ unique: true })
    shortCode!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ default: 0 })
    visitCount!: number;
}
