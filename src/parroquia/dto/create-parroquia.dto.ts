import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Canton } from 'src/canton/entities/canton.entity';
import { Circunscripcion } from '../../circunscripcion/entities/circunscripcion.entity';

export class CreateParroquiaDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoParroquia: number;

  @IsString()
  nombreParroquia: string;

  @IsString()
  estadoParroquia: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoCanton: number;

  @IsOptional()
  @IsString()
  nombreCircunscripcion?: string;

  @IsOptional()
  canton?: Canton;

  @IsOptional()
  circunscripcion?: Circunscripcion;
}
