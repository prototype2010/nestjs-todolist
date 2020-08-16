import {
  BaseEntity,
  Column,
  Entity, IsNull,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status-enum';
import { Project } from '../project/project.entity';
import {Optional} from "@nestjs/common";

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @Column()
  title: string;

  @Column({nullable: true})
  deadline: Date | null

  @Column()
  status: TaskStatus;

  @ManyToOne(
    type => Project,
    project => project.tasks,
    { eager: false },
  )
  project: Project;
}
