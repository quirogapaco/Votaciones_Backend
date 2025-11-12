import { Type } from "class-transformer";
import { IsArray, IsInt, IsString, Min, ValidateNested } from "class-validator"

class CandidatoVotoDto{
    @IsString()
    idCandidato: string;
    @IsInt()
    @Min(1)
    cantidad: number
}

export class UpsertVotoDto{
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CandidatoVotoDto)
    candidatos: CandidatoVotoDto[];
    @IsString()
    idJunta: string; 
    @IsString()
    idSimulacion: string;
}