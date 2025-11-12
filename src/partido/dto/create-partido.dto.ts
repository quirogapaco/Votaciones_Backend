import { IsString, IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePartidoDto {
  @IsString()
  nombrePartido: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  numPartido: number;

  @IsOptional()
  @IsString()
  fotoPartido?: string;
}
