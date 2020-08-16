import moment from 'moment';
import {
    ArgumentMetadata,
    BadRequestException,
    PipeTransform,
} from '@nestjs/common';

export class TimeFormatValidation implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any {
        if (!this.isValid(value)) {
            throw new BadRequestException(`Dealine has invalid date format/ use ISOString`);
        }

        return value;
    }

    isValid(value: any): boolean{
        return moment(value).isValid()
    }
}
