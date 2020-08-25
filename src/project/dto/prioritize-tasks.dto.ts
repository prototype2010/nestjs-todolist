import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateTaskDTO } from '../../tasks/dto/CreateTaskDTO';

export class PrioritizeTasksDTO {
  @Transform(value => JSON.parse(value))
  @ValidateNested({ each: true })
  @IsDefined()
  @IsArray()
  @Type(() => CreateTaskDTO)
  tasks: CreateTaskDTO[];
}
