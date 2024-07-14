import { Delete } from "@nestjs/common";
import { text } from "stream/consumers";
import { BeforeInsert, Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({ nullable: false })
    public name: string;

    @Column({ unique: true, nullable: false },)
    public email: string;

    @Column({ nullable: false})
    public password: string;

    @Column({ nullable: false})
    public role: string;

    @Column({nullable: true })
    public profileImage: string;

    @Column({ nullable: false})
    favoriteMovie: string;

    @Column({ type: 'simple-array', nullable: true})
    products: string[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    public createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;
}