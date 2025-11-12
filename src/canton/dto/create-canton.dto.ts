import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Provincia } from 'src/provincia/entities/provincia.entity';

export class CreateCantonDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoCanton: number;

  @IsString()
  nombreCanton: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoProvincia: number;

  @IsOptional()
  provincia?: Provincia;
}
