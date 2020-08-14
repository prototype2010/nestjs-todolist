import {IsNotEmpty, MaxLength, MinLength} from 'class-validator';

export class CreateProjectDTO {
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(50)
    name: string
}
