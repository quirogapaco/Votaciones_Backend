import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Circunscripcion } from 'src/circunscripcion/entities/circunscripcion.entity';
import { Provincia } from 'src/provincia/entities/provincia.entity';

export class CreateCandidatoDto {
  @IsString()
  nombreCandidato: string;

  @IsString()
  posicion: string;

  @IsOptional()
  @IsString()
  fotoCandidato?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  codigoProvincia?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  codigoCircunscripcion?: number;

  @IsOptional()
  provincia?: Provincia;

  @IsOptional()
  circunscripcion?: Circunscripcion;
}
