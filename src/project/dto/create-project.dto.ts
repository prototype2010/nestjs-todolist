import {IsDate, IsDateString, IsNotEmpty, IsOptional, MaxLength, MinLength} from 'class-validator';

export class CreateProjectDTO {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}
