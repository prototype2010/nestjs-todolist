import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/CreateTaskDTO';
import { TaskStatus } from './task-status-enum';
import { Project } from '../project/project.entity';
import * as moment from 'moment';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTask(taskId: number, projectId: number): Promise<Task> {
    const task = await this.findOne({ where: { id: taskId, projectId } });

    if (!task) {
      throw new NotFoundException(`Task not found`);
    }

    return task;
  }

  async createTask(
    { name, deadline }: CreateTaskDTO,
    project: Project,
  ): Promise<Task> {
    const task = new Task();

    task.name = name;
    task.status = TaskStatus.IN_PROGRESS;
    task.projectId = project.id;

    if (deadline) {
      task.deadline = moment(deadline).toDate();
    }

    await task.save();

    return task;
  }

  async updateTask(
    taskId: number,
    projectId: number,
    createTaskDto: CreateTaskDTO,
  ): Promise<Task> {
    const { deadline, status, name, order } = createTaskDto;

    const task = await this.getTask(taskId, projectId);

    if (deadline) {
      task.deadline = moment(deadline).toDate();
    }

    if (status) {
      task.status = status as TaskStatus;
    }

    if (order) {
      task.order = order;
    }

    task.name = name;

    await task.save();

    return task;
  }
}
