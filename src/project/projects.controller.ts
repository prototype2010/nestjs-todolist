import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {ProjectsService} from "./projects.service";
import {CreateProjectDTO} from "./dto/create-project.dto";

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {
    }

    @Post()
    @UsePipes(ValidationPipe)
    createProject(@Body() createProjectDTO: CreateProjectDTO,
                  @GetUser() user: User) {
        return this.projectsService.createProject(createProjectDTO,user);
    }

    @Post('/:id')
    @UsePipes(ValidationPipe)
    updateProject(@Param('id', ParseIntPipe) projectId: number,
                  @Body() createProjectDTO: CreateProjectDTO,
                  @GetUser() user: User) {
        return this.projectsService.updateProject(projectId,createProjectDTO,user);
    }

    @Get('/:id')
    getProject(@Param('id', ParseIntPipe) projectId: number,
               @GetUser() user: User) {
        return this.projectsService.getProject(projectId,user);
    }

    @Get()
    getAllProjects(@GetUser() user: User) {
        return this.projectsService.getAllProjects(user);
    }

    @Delete('/:id')
    deleteProject(@Param('id', ParseIntPipe) projectId: number,
                  @GetUser() user: User) {
        return this.projectsService.deleteProject(projectId, user);
    }

}
