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

    async getTasks(filterDTO: GetTaskFilterDto) {
        return this.taskRepository.getTasks(filterDTO);
    }

    async getTaskById(id: number) : Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Task not found`);
        }

        return  found
    }

    async createTask(createTaskDto : CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(taskId: number) : Promise<void> {
        const result = await this.taskRepository.delete(taskId)

        if(result.affected === 0) {
            throw new NotFoundException(`Task not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task:Task = await this.getTaskById(id);

        task.status = status;

        await task.save();

        return task;
    }
}
