import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import {AuthModule} from "../auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmConfig} from "../../config/typeorm.config";

describe('Users', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule],
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/GET cats`, () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({email: 'asdasdasdsa@mail.ru', password: 'asdasdasd', repeatPassword: 'asdasdasd'})
            .expect(201)
    });

    afterAll(async () => {
        await app.close();
    });
});
