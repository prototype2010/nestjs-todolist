import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/CreateTaskDTO';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('/projects/:projectId')
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDTO,
    @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, projectId, user);
  }


  @Put('/projects/:projectId')
  @UsePipes(new ValidationPipe({ transform: true }))
  applyTasksOrder(
      @Body() priorityTasksDto: any,
      @Param('projectId', ParseIntPipe) projectId: number,
      @GetUser() user: User,
      )  {

    return this.tasksService.prioritizeTasks(projectId, priorityTasksDto.tasks, user);
  }

  @Get('/:taskId/projects/:projectId')
  getTaskById(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTask(taskId, projectId, user);
  }

  @Delete('/:taskId/projects/:projectId')
  deleteTaskById(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.deleteTask(taskId, projectId, user);
  }

  @Put('/:taskId/projects/:projectId')
  @UsePipes(ValidationPipe)
  updateTaskStatus(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createTaskDto: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(taskId, projectId, createTaskDto, user);
  }
}
