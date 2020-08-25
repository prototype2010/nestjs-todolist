import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDTO } from './dto/CreateTaskDTO';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { User } from '../auth/user.entity';
import { ProjectRepository } from '../project/project.repository';
import { Project } from '../project/project.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
  ) {}
  //
  // async getTasksByProjectId(projectId: number, user: User) {
  //   return this.taskRepository.getTasksByProjectId(projectId, user);
  // }
  //
  async getTask(taskId: number, projectId: number, user: User): Promise<Task> {
    /* verify this project belongs to the user */
    await this.projectRepository.getProject(projectId, user);

    return this.taskRepository.getTask(taskId, projectId);
  }

  async createTask(
    createTaskDto: CreateTaskDTO,
    projectId: number,
    user: User,
  ): Promise<Task> {
    /* verify this project belongs to the user */
    const project: Project = await this.projectRepository.getProject(
      projectId,
      user,
    );

    return await this.taskRepository.createTask(createTaskDto, project);
  }

  async deleteTask(
    taskId: number,
    projectId: number,
    user: User,
  ): Promise<Task> {
    /* verify this project belongs to the user */
    await this.projectRepository.getProject(projectId, user);

    const task = await this.taskRepository.getTask(taskId, projectId);

    await task.remove();

    return task;
  }

  async updateTask(
    taskId: number,
    projectId: number,
    createTaskDto: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    await this.projectRepository.getProject(projectId, user);

    return this.taskRepository.updateTask(taskId, projectId, createTaskDto);
  }

  async prioritizeTasks(
    projectId: number,
    tasks: CreateTaskDTO[],
    user,
  ): Promise<Array<Task>> {
    await this.projectRepository.getProject(projectId, user);

    for await (const task of tasks) {
      const taskToUpdate = await this.taskRepository.getTask(
        task.id,
        projectId,
      );

      taskToUpdate.order = task.order;

      await taskToUpdate.save();
    }

    const project = await this.projectRepository.getProject(projectId, user);

    return project
        .tasks
        .sort((a,b) => b.order - a.order);
  }
}
