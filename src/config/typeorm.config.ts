import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {Task} from "../tasks/task.entity";
import {User} from "../auth/user.entity";
import * as config from 'config';

const {type, port, database, synchronize, username, password, host} = config.get('db');

export const typeOrmConfig : TypeOrmModuleOptions = {
    type,
    host,
    port,
    username,
    password,
    database,
    entities: [Task, User],
    synchronize,
};
