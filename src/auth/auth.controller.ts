import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {AuthService} from "./auth.service";
import {JwtToken} from "./interfaces/jwt-token.interface";

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService) {}

    @Post('/signup')
    singUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    singIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<JwtToken> {
        return this.authService.signIn(authCredentialsDto);
    }
}
