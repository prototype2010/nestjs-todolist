import {EntityRepository, Repository} from "typeorm";
import {Task} from "./task.entity";
import {CreateTaskDto} from "./dto/CreateTaskDto";
import {TaskStatus} from "./task-status-enum";
import {GetTaskFilterDto} from "./dto/GetTaskFilterDto";
import {User} from "../auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks({search,status}: GetTaskFilterDto): Promise<Array<Task>> {
        const query = this.createQueryBuilder('task');

        if(status) {
           query.andWhere('task.status = :status', {status});
        }

        if(search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
        }

        const tasks = await query.getMany();

        return tasks;
    }

    async createTask(
        {description,title} : CreateTaskDto,
        user: User)
        : Promise<Task>
    {

        const task = new Task();

        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await task.save();

        delete task.user;

        return task;
    }
}