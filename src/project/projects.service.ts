import { Injectable } from '@nestjs/common';
import {User} from "../auth/user.entity";
import {ProjectRepository} from "./project.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateProjectDTO} from "./dto/create-project.dto";
import {Project} from "./project.entity";

@Injectable()
export class ProjectsService {
    constructor( @InjectRepository(ProjectRepository) private projectRepository: ProjectRepository) {}

    getAllProjects(user: User): Promise<Array<Project>> {
        return this.projectRepository.getAllProjects(user)
    }

    createProject(createProjectDTO: CreateProjectDTO, user: User): Promise<Project> {
        return this.projectRepository.createProject(createProjectDTO,user)
    }

    updateProject(projectId: number,createProjectDTO: CreateProjectDTO, user: User): Promise<Project> {
        return this.projectRepository.updateProject(projectId,createProjectDTO,user)
    }

    getProject(projectId: number, user: User): Promise<Project> {
        return this.projectRepository.getProject(projectId,user)
    }

    deleteProject(projectId: number, user: User): Promise<Project> {
        return this.projectRepository.deleteProject(projectId, user)
    }
}
