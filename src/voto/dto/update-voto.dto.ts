import { PartialType } from '@nestjs/mapped-types';
import { CreateVotoDto } from './create-voto.dto';
import { IsNumber } from 'class-validator';

export class UpdateVotoDto extends PartialType(CreateVotoDto) {
    @IsNumber()
    cantidad?: number;
}
