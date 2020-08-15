import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../task-status-enum';

export class TasksStatusValidationPipe implements PipeTransform {
  private readonly statuses = [
    TaskStatus.OPEN,
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
  ];

  transform(value: any, metadata: ArgumentMetadata): any {
    if (!this.isValid(value)) {
      throw new BadRequestException(`Status should be one of ${this.statuses}`);
    }

    return value;
  }

  private isValid(value: any) {
    return this.statuses.includes(value);
  }
}
