import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../config/typeorm.config';
import { AuthModule } from '../../auth/auth.module';
import { ProjectsModule } from '../../project/projects.module';
import * as faker from 'faker';
import * as request from 'supertest';
import { TasksModule } from '../tasks.module';

describe('Create tasks inside project', () => {
  let app: INestApplication;
  let token;
  let projectName;
  let projectId;
  let taskName;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        AuthModule,
        TasksModule,
        ProjectsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    projectName = faker.internet.password(10);
    taskName = faker.internet.password(10);
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
    const response = await request(app.getHttpServer())
      .post(`/tasks/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: taskName })
      .expect(201);

    const {
      title,
      status,
      projectId: _projectId,
      deadline,
      id,
    } = response.body;

    expect(title).toBe(taskName);
    expect(status).toBe('inProgress');
    expect(_projectId).toBe(projectId);
    expect(deadline).toBe(null);
    expect(id).toBeTruthy();
  });

  it(`Successfully create task with deadline`, async () => {
    const taskDeadline = new Date().toISOString();

    const response = await request(app.getHttpServer())
      .post(`/tasks/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: taskName, deadline: taskDeadline })
      .expect(201);

    const {
      title,
      status,
      projectId: _projectId,
      deadline,
      id,
    } = response.body;

    expect(title).toBe(taskName);
    expect(status).toBe('inProgress');
    expect(_projectId).toBe(projectId);
    expect(deadline).toBe(taskDeadline);
    expect(id).toBeTruthy();
  });

  it(`Cannot create without title`, async () => {
    const taskDeadline = new Date().toISOString();

    await request(app.getHttpServer())
      .post(`/tasks/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', deadline: taskDeadline })
      .expect(400, {
        statusCode: 400,
        message: [
          'title should not be empty',
          'title must be longer than or equal to 4 characters',
        ],
        error: 'Bad Request',
      });
  });

  it(`Cannot create with empty body`, async () => {
    await request(app.getHttpServer())
      .post(`/tasks/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400, {
        statusCode: 400,
        message: [
          'title should not be empty',
          'title must be shorter than or equal to 30 characters',
          'title must be longer than or equal to 4 characters',
        ],
        error: 'Bad Request',
      });
  });

  it(`Cannot create under not existing project `, async () => {
    await request(app.getHttpServer())
      .post(`/tasks/projects/${9999999}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: taskName })
      .expect(404, {
        statusCode: 404,
        message: 'Project not found',
        error: 'Not Found',
      });
  });

  it(`Other guy cannot create task under your project`, async () => {
    ///////////// OTHER GUY /////////////////////
    const email2 = faker.internet.email();
    const password2 = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email2,
        password: password2,
        repeatPassword: password2,
      });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: email2, password: password2 });

    const otherGuyToken = response.body.token;
    /////////////////////////////////////////////

    await request(app.getHttpServer())
      .post(`/tasks/projects/${projectId}`)
      .set('Authorization', `Bearer ${otherGuyToken}`)
      .send({ title: taskName })
      .expect(404, {
        statusCode: 404,
        message: 'Project not found',
        error: 'Not Found',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('Get project task', () => {
  let app: INestApplication;
  let token;
  let projectName;
  let projectId;
  let taskName;
  let taskId;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        AuthModule,
        TasksModule,
        ProjectsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    projectName = faker.internet.password(10);
    taskName = faker.internet.password(10);
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

    const task = await request(app.getHttpServer())
      .post(`/tasks/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: taskName })
      .expect(201);

    taskId = task.body.id;
  });

  it(`Correct server response for existing task`, async () => {
    await request(app.getHttpServer())
      .get(`/tasks/${taskId}/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it(`Details match for existing task`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/tasks/${taskId}/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const {
      title,
      status,
      projectId: _projectId,
      deadline,
      id,
    } = response.body;

    expect(title).toBe(taskName);
    expect(status).toBe('inProgress');
    expect(_projectId).toBe(projectId);
    expect(deadline).toBe(null);
    expect(id).toBe(taskId);
  });

  it(`Not existing task returns 404`, async () => {
    await request(app.getHttpServer())
      .get(`/tasks/999999999/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: 'Task not found',
        error: 'Not Found',
      });
  });

  it(`Not existing project returns 404`, async () => {
    await request(app.getHttpServer())
      .get(`/tasks/${taskId}/projects/${999999999}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: 'Project not found',
        error: 'Not Found',
      });
  });
  it(`Other guy cannot access your tasks`, async () => {
    ///////////// OTHER GUY /////////////////////
    const email2 = faker.internet.email();
    const password2 = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email2,
        password: password2,
        repeatPassword: password2,
      });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: email2, password: password2 });

    const otherGuyToken = response.body.token;
    /////////////////////////////////////////////
    await request(app.getHttpServer())
      .get(`/tasks/${taskId}/projects/${projectId}`)
      .set('Authorization', `Bearer ${otherGuyToken}`)
      .expect(404, {
        statusCode: 404,
        message: 'Project not found',
        error: 'Not Found',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('Delete task', () => {
  let app: INestApplication;
  let token;
  let projectName;
  let projectId;
  let taskName;
  let taskId;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        AuthModule,
        TasksModule,
        ProjectsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    projectName = faker.internet.password(10);
    taskName = faker.internet.password(10);
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

    const task = await request(app.getHttpServer())
      .post(`/tasks/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: taskName })
      .expect(201);

    taskId = task.body.id;
  });

  it(`Task can be deleted successfully`, async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it(`Deleted task structure matches`, async () => {
    const response = await request(app.getHttpServer())
      .delete(`/tasks/${taskId}/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const {
      title,
      status,
      projectId: _projectId,
      deadline,
      id,
    } = response.body;

    expect(title).toBe(taskName);
    expect(status).toBe('inProgress');
    expect(_projectId).toBe(projectId);
    expect(deadline).toBe(null);
  });

  it(`Deleted task cannot be deleted again`, async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: 'Task not found',
        error: 'Not Found',
      });
  });

  it(`Deleting task in not existing project returns error`, async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}/projects/${999999999}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: 'Project not found',
        error: 'Not Found',
      });
  });

  it(`Deleting not existing task in project returns error`, async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${999999999}/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: 'Task not found',
        error: 'Not Found',
      });
  });

  it(`Other guy cannot access your tasks`, async () => {
    ///////////// OTHER GUY /////////////////////
    const email2 = faker.internet.email();
    const password2 = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email2,
        password: password2,
        repeatPassword: password2,
      });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: email2, password: password2 });

    const otherGuyToken = response.body.token;
    /////////////////////////////////////////////

    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}/projects/${projectId}`)
      .set('Authorization', `Bearer ${otherGuyToken}`)
      .expect(404, {
        statusCode: 404,
        message: 'Project not found',
        error: 'Not Found',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
