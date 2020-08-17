import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDTO {
  @MinLength(4)
  @MaxLength(30)
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  deadline: string;
}
