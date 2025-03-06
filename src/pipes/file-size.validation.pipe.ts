import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
//I did not use this
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const fiveMb = 5000_000;
    return value.size < fiveMb;
  }
}
