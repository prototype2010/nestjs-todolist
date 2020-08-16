import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDTO } from './dto/CreateTaskDTO';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { User } from '../auth/user.entity';
import {ProjectRepository} from "../project/project.repository";
import {Project} from "../project/project.entity";
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository
  ) {}
  //
  // async getTasksByProjectId(projectId: number, user: User) {
  //   return this.taskRepository.getTasksByProjectId(projectId, user);
  // }
  //
  // async getTaskById(taskId: number, projectId, user: User): Promise<Task> {
  //   const found = await this.taskRepository.findOne({
  //     where: { taskId, userId: user.id },
  //   });
  //
  //   if (!found) {
  //     throw new NotFoundException(`Task not found`);
  //   }
  //
  //   return found;
  // }

  async createTask(createTaskDto: CreateTaskDTO, projectId: number, user: User): Promise<Task> {

    const project:Project = await this.projectRepository.getProject(projectId, user);

    return this.taskRepository.createTask(createTaskDto,project,user);
  }

  // async deleteTaskById(taskId: number, user: User): Promise<void> {
  //   const result = await this.taskRepository.delete({
  //     id: taskId,
  //     userId: user.id,
  //   });
  //
  //   if (result.affected === 0) {
  //     throw new NotFoundException(`Task not found`);
  //   }
  // }
  //
  // async updateTaskStatus(
  //   id: number,
  //   status: TaskStatus,
  //   user: User,
  // ): Promise<Task> {
  //   const task: Task = await this.getTaskById(id, user);
  //
  //   task.status = status;
  //
  //   await task.save();
  //
  //   return task;
  // }
}
