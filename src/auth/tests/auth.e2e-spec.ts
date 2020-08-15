import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../config/typeorm.config';
import * as faker from 'faker';

describe('Sign-up', () => {
  let app: INestApplication;
  let email: string;
  let password: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    email = faker.internet.email();
    password = faker.internet.password();
  });

  it(`Correct registration`, () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password, repeatPassword: password })
      .expect(201, {});
  });

  it(`Empty repeat password`, () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password, repeatPassword: 'password' })
      .expect(400, {
        statusCode: 400,
        message: 'Passwords should match',
        error: 'Bad Request',
      });
  });

  it(`Empty email`, () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: '', password, repeatPassword: password })
      .expect(400, {
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      });
  });

  it(`Empty password`, () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'awsdasdas', repeatPassword: password })
      .expect(400, {
        statusCode: 400,
        message: 'Passwords should match',
        error: 'Bad Request',
      });
  });

  it(`Missing field`, () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password })
      .expect(400, {
        statusCode: 400,
        message: [
          'repeatPassword must be shorter than or equal to 20 characters',
          'repeatPassword must be longer than or equal to 8 characters',
          'repeatPassword must be a string',
        ],
        error: 'Bad Request',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('Sign-in', () => {
  let app: INestApplication;
  let email: string;
  let password: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    email = faker.internet.email();
    password = faker.internet.password();

    // registration completed
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password, repeatPassword: password });
  });

  it(`successful sign-in`, async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);

    expect(response.body.token).toBeTruthy();
  });

  it(`empty password`, async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: '' })
      .expect(400, {
        statusCode: 400,
        message: ['password must be longer than or equal to 8 characters'],
        error: 'Bad Request',
      });
  });

  it(`wrong password`, async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'definitely_wrong' })
      .expect(401, {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
  });

  it(`invalid email`, async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'theBest-email', password: '' })
      .expect(400, {
        statusCode: 400,
        message: [
          'email must be an email',
          'password must be longer than or equal to 8 characters',
        ],
        error: 'Bad Request',
      });
  });

  it(`nonexisting email`, async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'theBest-email@gmail.com', password })
      .expect(401, {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
  });

  it(`empty email`, async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: '', password })
      .expect(400, {
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
