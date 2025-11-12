import { PartialType } from '@nestjs/mapped-types';
import { CreateDignidadDto } from './create-dignidad.dto';

export class UpdateDignidadDto extends PartialType(CreateDignidadDto) {}
