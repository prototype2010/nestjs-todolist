import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {JwtService} from "@nestjs/jwt";
import {JwtPayload} from "./interfaces/jwt-payload.interface";
import {JwtToken} from "./interfaces/jwt-token.interface";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<JwtToken> {

        const user = await this.userRepository.validatePassword(authCredentialsDto);

        if(!user) {
            throw new UnauthorizedException('Invalid credentials')
        } else {

            const payload: JwtPayload = {user, role: 'test_role'};

            const token = await this.jwtService.sign(payload);

            return {token};
        }
    }
}

