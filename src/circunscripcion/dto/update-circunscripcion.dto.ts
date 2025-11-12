import { PartialType } from '@nestjs/mapped-types';
import { CreateCircunscripcionDto } from './create-circunscripcion.dto';

export class UpdateCircunscripcionDto extends PartialType(CreateCircunscripcionDto) {}
