import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class SignUpDTO {
    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    repeatPassword: string;
}
