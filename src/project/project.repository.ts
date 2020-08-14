import {EntityRepository, Repository} from "typeorm";
import {Project} from "./project.entity";
import {User} from "../auth/user.entity";
import {CreateProjectDTO} from "./dto/create-project.dto";
import {NotFoundException} from "@nestjs/common";

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project>{

    async getAllProjects(user: User):Promise<Array<Project>> {
        const query = this.createQueryBuilder('projects');

        query.where('project.userId = :userId', {userId: user.id})

        const projects = await query.getMany();

        return projects;
    }

    async createProject({name}: CreateProjectDTO, user: User): Promise<Project>  {

        const project = new Project();

        project.name = name;
        project.user = user;

        await project.save();

        delete project.user;

        return project;
    }


    async updateProject(projectId: number,{name}: CreateProjectDTO, user: User) {

        const project = await this.getProjectByIdAndUser(projectId, user);

        project.name = name;

        await project.save();

        return project;
    }

    getProject(projectId: number, user: User): Promise<Project>  {
        return this.getProjectByIdAndUser(projectId, user);
    }

    async deleteProject(projectId: number, user: User) {
        const project = await this.getProjectByIdAndUser(projectId, user);

        await project.remove();

        return project;
    }

    private  async getProjectByIdAndUser(projectId : number, user :User): Promise<Project> {
        const project = await this.findOne({where : {id: projectId, userId: user.id}})

        if(!project) {
            throw new NotFoundException('Project not found');
        }

        return project
    }
}
