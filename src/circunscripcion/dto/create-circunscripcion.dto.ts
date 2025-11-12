import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CreateCircunscripcionDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoCircunscripcion: number;

  @IsString()
  nombreCircunscripcion: string;
}
