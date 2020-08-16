import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmConfig} from "../../config/typeorm.config";
import {AuthModule} from "../../auth/auth.module";
import {ProjectsModule} from "../../project/projects.module";
import * as faker from "faker";
import * as request from "supertest";

describe('Update project', () => {
    let app: INestApplication;
    let token;
    let projectName;
    let projectId;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmConfig),
                AuthModule,
                ProjectsModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        projectName = faker.company.companyName();
        const email = faker.internet.email();
        const password = faker.internet.password();

        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password, repeatPassword: password });

        const response = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({ email, password });

        token = response.body.token;

        const project = await request(app.getHttpServer())
            .post('/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: projectName })
            .expect(201);

        projectId = project.body.id;
    });

    it(`Successfully create task inside a project`, async () => {
        const newProjectName = faker.company.companyName();

        const project = await request(app.getHttpServer())
            .put(`/projects/${projectId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: newProjectName })
            .expect(200);

        expect(project.body.name).toBe(newProjectName);
        expect(project.body.id).toBe(projectId);
    });

    afterAll(async () => {
        await app.close();
    });
});
