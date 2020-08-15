import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtToken } from './interfaces/jwt-token.interface';
import { SignUpDTO } from './dto/sign-up.dto';
import { SignInDTO } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  singUp(@Body(ValidationPipe) authCredentialsDto: SignUpDTO) {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  singIn(
    @Body(ValidationPipe) authCredentialsDto: SignInDTO,
  ): Promise<JwtToken> {
    return this.authService.signIn(authCredentialsDto);
  }
}
