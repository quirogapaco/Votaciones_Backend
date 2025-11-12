import { IsNumber, IsString } from 'class-validator';

export class CreateZonaDto {
    @IsNumber()
    codigoZona: number;
    @IsString()
    nombreZona: string;
}
