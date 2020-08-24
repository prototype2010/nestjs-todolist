import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDateString, IsDefined, IsJSON,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested
} from 'class-validator';
import {Transform, Type} from "class-transformer";
import {CreateTaskDTO} from "../../tasks/dto/CreateTaskDTO";
import {Logger, ParseArrayPipe} from "@nestjs/common";


export class PrioritizeTasksDTO {

  //
  @Transform((value) => JSON.parse(value) )
  @ValidateNested({ each: true })
  @IsDefined()
  @IsArray()
  @Type(() => CreateTaskDTO)
  tasks: CreateTaskDTO[];
}
