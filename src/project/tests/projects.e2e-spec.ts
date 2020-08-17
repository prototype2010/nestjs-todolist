import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../config/typeorm.config';
import * as faker from 'faker';
import { AuthModule } from '../../auth/auth.module';
import { ProjectsModule } from '../projects.module';

describe('Create project', () => {
  let app: INestApplication;
  let token;
  let projectName;

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
    projectName = faker.internet.password(10);
    const email = faker.internet.email();
    const password = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password, repeatPassword: password });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password });

    token = response.body.token;
  });

  it(`Successful create project`, async () => {
    const company = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: projectName })
      .expect(201);

    expect(company.body.name).toBe(projectName);
    expect(company.body.id).toBeTruthy();
  });

  it(`Creating unathorized`, async () => {
    await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer XXXXXXX`)
      .send({ name: projectName })
      .expect(401, { statusCode: 401, message: 'Unauthorized' });
  });

  it(`Empty company name`, async () => {
    await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })
      .expect(400, {
        statusCode: 400,
        message: [
          'name must be longer than or equal to 4 characters',
          'name should not be empty',
        ],
        error: 'Bad Request',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

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
    projectName = faker.internet.password(10);
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

  it(`Successfully update project`, async () => {
    const newProjectName = faker.company.companyName();

    const project = await request(app.getHttpServer())
      .put(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: newProjectName })
      .expect(200);

    expect(project.body.name).toBe(newProjectName);
    expect(project.body.id).toBe(projectId);
  });

  it(`Update project with empty name`, async () => {
    await request(app.getHttpServer())
      .put(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })
      .expect(400, {
        statusCode: 400,
        message: [
          'name must be longer than or equal to 4 characters',
          'name should not be empty',
        ],
        error: 'Bad Request',
      });
  });

  it(`Update project with very long name`, async () => {
    await request(app.getHttpServer())
      .put(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: projectName.repeat(20) })
      .expect(400, {
        statusCode: 400,
        message: ['name must be shorter than or equal to 50 characters'],
        error: 'Bad Request',
      });
  });

  it(`Update other guy project`, async () => {
    ////////// OTHER GUY PROJECT ///////////////
    const projectName2 = faker.internet.password(10);
    const email2 = faker.internet.email();
    const password2 = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email2, password: password2, repeatPassword: password2 });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: email2, password: password2 });

    const token2 = response.body.token;

    const otherProject = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token2}`)
      .send({ name: projectName2 })
      .expect(201);

    ////////////////////////////////////////////

    await request(app.getHttpServer())
      .put(`/projects/${otherProject.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Another name' })
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

describe('Delete project', () => {
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

  it(`Delete project`, async () => {
    await request(app.getHttpServer())
      .delete(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it(`Deleted project cannot be gotten`, async () => {
    await request(app.getHttpServer())
      .delete(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: 'Project not found',
        error: 'Not Found',
      });
  });

  it(`Deleted project cannot be found among all user projects`, async () => {
    await request(app.getHttpServer())
      .delete(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/projects`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200, []);
  });

  it(`Delete other guy project should not be successful`, async () => {
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
      .delete(`/projects/${projectId}`)
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

describe('Get project by id', () => {
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
    projectName = faker.internet.password(10);
    const email = faker.internet.email();
    const password = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password, repeatPassword: password });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password });

    token = response.body.token;

    const company = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: projectName });

    projectName = company.body.name;
    projectId = company.body.id;
  });

  it(`Get project by id`, async () => {
    const company = await request(app.getHttpServer())
      .get(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(company.body.name).toBe(projectName);
    expect(company.body.id).toBe(projectId);
    expect(company.body.userId).toBeTruthy();
    expect(company.body.tasks).toStrictEqual([]);
  });

  it(`Get wrong project by id`, async () => {
    await request(app.getHttpServer())
      .get(`/projects/999999999`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(404, {
        statusCode: 404,
        message: 'Project not found',
        error: 'Not Found',
      });
  });

  it(`Get other guy project by id`, async () => {
    // CREATING OTHER GUY ////////////
    const email2 = faker.internet.email();
    const password2 = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email2, password: password2, repeatPassword: password2 });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: email2, password: password2 });
    /////////////////////////////////////

    await request(app.getHttpServer())
      .get(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .send()
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

describe('Get all projects', () => {
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
    projectName = faker.internet.password(10);
    const email = faker.internet.email();
    const password = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password, repeatPassword: password });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password });

    token = response.body.token;

    const company = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: projectName });

    projectName = company.body.name;
    projectId = company.body.id;
  });

  it(`Get all projects`, async () => {
    const companies = await request(app.getHttpServer())
      .get(`/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(companies.body.length).toBe(1);
    expect(companies.body[0].id).toBe(projectId);
    expect(companies.body[0].name).toBe(projectName);
  });

  it(`Get all projects if they more than 1`, async () => {
    /// SECOND COMPANY ///////
    await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: faker.company.companyName() });
    //////////////////////////

    const companies = await request(app.getHttpServer())
      .get(`/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(companies.body.length).toBe(2);
  });

  afterAll(async () => {
    await app.close();
  });
});
