import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDignidadDto {
  @IsString()
  nombreDignidad: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  codigoDignidad: number;

  @IsString()
  @IsOptional()
  fotoDignidad?: string;
}
