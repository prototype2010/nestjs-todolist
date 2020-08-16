import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/CreateTaskDTO';
import { TaskStatus } from './task-status-enum';
import { User } from '../auth/user.entity';
import {Project} from "../project/project.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasksByProjectId(
      projectId: number,

    user: User,
  ): Promise<Array<Task>> {

    const query = this.createQueryBuilder('project');



    // if (status) {
    //   query.andWhere('task.status = :status', { status });
    // }
    //
    // if (search) {
    //   query.andWhere(
    //     '(task.title LIKE :search OR task.description LIKE :search)',
    //     { search: `%${search}%` },
    //   );
    // }

    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(
    { title, deadline }: CreateTaskDTO,
    project: Project,
    user: User,
  ): Promise<Task> {

    const task = new Task();

    task.title = title;
    task.status = TaskStatus.OPEN;
    task.projectId = project.id;


    await task.save();

    return task;
  }
}
