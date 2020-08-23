import {
  BaseEntity,
  Column,
  Entity,
  IsNull,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status-enum';
import { Project } from '../project/project.entity';
import { Optional } from '@nestjs/common';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  deadline: Date;

  @Column({ nullable: true })
  order: number;

  @Column()
  status: TaskStatus;

  @ManyToOne(
    type => Project,
    project => project.tasks,
    { eager: false },
  )
  project: Project;
}
