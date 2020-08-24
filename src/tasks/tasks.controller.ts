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
import { TasksStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { ProjectsService } from '../project/projects.service';
import { TimeFormatValidation } from './pipes/time-format-validation.pipe';
import {PrioritizeTasksDTO} from "../project/dto/prioritize-tasks.dto";
import {Transform} from "stream";
import {pipeFromArray} from "rxjs/internal/util/pipe";

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
      @Body() priorityTasksDto: PrioritizeTasksDTO,
      @Param('projectId', ParseIntPipe) projectId: number)  {

    console.log(priorityTasksDto)
    console.log(typeof priorityTasksDto)
    console.log(typeof priorityTasksDto.tasks[0])

    // return this.tasksService.createTask(createTaskDto, projectId, user);
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
