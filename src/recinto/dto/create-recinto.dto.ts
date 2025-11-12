import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Parroquia } from 'src/parroquia/entities/parroquia.entity';
import { Zona } from 'src/zona/entities/zona.entity';

export class CreateRecintoDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoRecinto: number;

  @IsString()
  nombreRecinto: string;

  @IsString()
  direccionRecinto: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  telefonoRecinto?: string | null;

  @IsNumber({}, { message: 'coorX debe ser un número válido' })
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  coorX: number | null;

  @IsNumber({}, { message: 'coorY debe ser un número válido' })
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  coorY: number | null;

  @IsNumber({}, { message: 'longitud debe ser un número válido' })
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  longitud: number | null;

  @IsNumber({}, { message: 'latitud debe ser un número válido' })
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  latitud: number | null;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoParroquia: number;

  @IsOptional()
  @IsString()
  nombreZona?: string;

  @IsOptional()
  parroquia?: Parroquia;

  @IsOptional()
  zona?: Zona;
}
