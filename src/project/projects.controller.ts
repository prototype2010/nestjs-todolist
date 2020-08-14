import {Controller, Get, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {ProjectsService} from "./projects.service";

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {
    }

    @Get()
    getAllProjects(@GetUser() user: User) {
        return this.projectsService
    }

}
