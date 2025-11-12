import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Recinto } from 'src/recinto/entities/recinto.entity';
export class CreateJuntaDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  numJunta: number;

  @IsString()
  genero: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoRecinto: number;

  @IsOptional()
  recinto?: Recinto;
}
