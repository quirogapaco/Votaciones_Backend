import { IsNotEmpty, IsString, IsInt, IsUUID, IsOptional } from 'class-validator';

export class CreateVotoDto {
  @IsNotEmpty()
  @IsString()
  tipoVoto: string;

  @IsNotEmpty()
  @IsInt()
  cantidad: number;

  @IsNotEmpty()
  @IsUUID()
  idJunta: string;

  @IsNotEmpty()
  @IsUUID()
  idSimulacion: string;

  @IsOptional()
  @IsUUID()
  idCandidato: string;
}
