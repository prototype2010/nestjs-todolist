import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import * as bcrypt from 'bcrypt';
import {Project} from "../project/project.entity";

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

    @OneToMany(type => Project, project => project.user, {eager: true})
    projects: Array<Project>;



    async isPasswordValid(password: string) {
        const hash = await bcrypt.hash(password, this.salt);

        return hash === this.password;
    }
}
