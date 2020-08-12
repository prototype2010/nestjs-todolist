import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {JwtModule} from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport';
import {JwtStrategy} from "./passport-strategy";

@Module({
    imports: [PassportModule.register({
        defaultStrategy: 'jwt',
         }),
        JwtModule.register({
        secret: 'ASDFGHJKL',
        signOptions:{
            expiresIn: 3600*24,
        }
    }), TypeOrmModule.forFeature([UserRepository])],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule {

}
