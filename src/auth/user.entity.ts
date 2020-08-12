import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import * as bcrypt from 'bcrypt';
import {resolveSrv} from "dns";
import {Task} from "../tasks/task.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    salt: string;

    @Column()
    password: string;

    @OneToMany(type => Task, task => task.user, {eager: true})
    tasks: Array<Task>;

    async isPasswordValid(password: string) {
        const hash = await bcrypt.hash(password, this.salt);

        return hash === this.password;
    }
}
