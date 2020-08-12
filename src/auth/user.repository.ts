import {EntityRepository, Repository} from "typeorm";
import * as bcrypt from 'bcrypt'
import {User} from "./user.entity";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {ConflictException} from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User>  {
    public async  signUp({password, username}: AuthCredentialsDto): Promise<void> {

        const existingUser = await this.findOne({username});

        if( existingUser) {
            throw new ConflictException('User with such username already exists');
        }

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt(10);
        user.password = await this.hashPassword(password, user.salt);

        await user.save()
    }

    private hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password,salt);
    }

    async validatePassword({password, username}: AuthCredentialsDto): Promise<string | null> {
        const user: User = await this.findOne({username});

        if(user && await user.isPasswordValid(password)) {
            return user.username;
        } else {
            return null;
        }
    }
}
