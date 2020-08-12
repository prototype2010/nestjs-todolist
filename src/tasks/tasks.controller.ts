import {
    Body,
    Controller, Delete,
    Get,
    Param,
    ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import {TasksService} from "./tasks.service";
import {CreateTaskDto} from "./dto/CreateTaskDto";
import {TasksStatusValidationPipe} from "./pipes/tasks-status-validation.pipe";
import {GetTaskFilterDto} from "./dto/GetTaskFilterDto";
import {Task} from "./task.entity";
import {TaskStatus} from "./task-status-enum";
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor( private tasksService : TasksService) {}

    @Get()
    getAllTasks(@Query(ValidationPipe) filterDTO : GetTaskFilterDto) {
        return this.tasksService.getTasks(filterDTO)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,

    ):Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) taskId: number ) : Promise<Task> {
        return this.tasksService.getTaskById(taskId);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) taskId: number) {
        return this.tasksService.deleteTaskById(taskId)
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TasksStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
    }
}
