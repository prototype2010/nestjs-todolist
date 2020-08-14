import { Injectable } from '@nestjs/common';
import {User} from "../auth/user.entity";
import {ProjectRepository} from "./project.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateProjectDTO} from "./dto/create-project.dto";

@Injectable()
export class ProjectsService {
    constructor( @InjectRepository(ProjectRepository) private projectRepository: ProjectRepository) {}


    getAllProjects(user: User) {
        return this.projectRepository.getAllProjects(user)
    }

    createProject(createProjectDTO: CreateProjectDTO, user: User) {
        return this.projectRepository.createProject(createProjectDTO,user)
    }

    updateProject(projectId: number,createProjectDTO: CreateProjectDTO, user: User) {
        return this.projectRepository.updateProject(projectId,createProjectDTO,user)
    }

    getProject(projectId: number, user: User) {
        return this.projectRepository.getProject(projectId,user)
    }

    deleteProject(projectId: number, user: User) {
        return this.projectRepository.deleteProject(projectId, user)
    }
}
