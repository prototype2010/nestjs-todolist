import {Injectable, NotFoundException} from '@nestjs/common';

import {CreateTaskDto} from "./dto/CreateTaskDto";
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {TaskStatus} from "./task-status-enum";
import {GetTaskFilterDto} from "./dto/GetTaskFilterDto";
import {User} from "../auth/user.entity";
@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository) {
    }

    async getTasks(filterDTO: GetTaskFilterDto, user: User) {
        return this.taskRepository.getTasks(filterDTO, user);
    }

    async getTaskById(
        id: number,
        user: User)
        : Promise<Task> {
        const found = await this.taskRepository.findOne({ where: {id, userId: user.id}});

        if(!found) {
            throw new NotFoundException(`Task not found`);
        }

        return  found;
    }

    async createTask(createTaskDto : CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(taskId: number,  user: User) : Promise<void> {
        const result = await this.taskRepository.delete({id: taskId, userId: user.id});

        if(result.affected === 0) {
            throw new NotFoundException(`Task not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus,user: User): Promise<Task> {
        const task:Task = await this.getTaskById(id, user);

        task.status = status;

        await task.save();

        return task;
    }
}
