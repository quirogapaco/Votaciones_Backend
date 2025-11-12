import { IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProvinciaDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoProvincia: number;

  @IsString()
  nombreProvincia: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  numElectores: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  numMujeres: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  numHombres: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  numJunta: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  numJuntasMujeres: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  numJuntasHombres: number;
}
