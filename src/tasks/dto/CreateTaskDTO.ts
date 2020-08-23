import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../task-status-enum';

export class CreateTaskDTO {
  @MinLength(4)
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  deadline: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn([TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  order: number;
}
