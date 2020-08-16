import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/CreateTaskDTO';
import { TasksStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import {ProjectsService} from "../project/projects.service";
import {TimeFormatValidation} from "./pipes/time-format-validation.pipe";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(
      private tasksService: TasksService,
  ) {}
  // @Get('/projects/:projectId')
  // getAllTasks(
  //     @Param('projectId', ParseIntPipe) projectId: number,
  //     @GetUser() user: User,
  // ) {
  //   return this.tasksService.getTasksByProjectId(projectId, user);
  // }

  @Post('/projects/:projectId')
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDTO,
    @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() user: User,
  ): Promise<Task> {
      return this.tasksService.createTask(createTaskDto, projectId, user);
  }

  @Get('/:taskId/projects/:projectId')
  getTaskById(
      @Param('taskId', ParseIntPipe) taskId: number,
      @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTask(taskId,projectId, user);
  }

  // @Delete('/tasks/:id/projects/:projectId')
  // deleteTaskById(
  //   @Param('id', ParseIntPipe) taskId: number,
  //   @GetUser() user: User,
  // ): Promise<void> {
  //   return this.tasksService.deleteTaskById(taskId, user);
  // }
  //
  // @Patch('/:id/status')
  // updateTaskStatus(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body('status', TasksStatusValidationPipe) status: TaskStatus,
  //   @GetUser() user: User,
  // ): Promise<Task> {
  //   return this.tasksService.updateTaskStatus(id, status, user);
  // }
}
