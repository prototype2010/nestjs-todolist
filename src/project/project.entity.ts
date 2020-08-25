import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { User } from '../auth/user.entity';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  @Column({ nullable: true })
  deadline: string;

  @OneToMany(
    type => Task,
    task => task.project,
    { eager: true },
  )
  tasks: Array<Task>;

  @ManyToOne(
    type => User,
    user => user.projects,
    { eager: false },
  )
  user: User;
}
