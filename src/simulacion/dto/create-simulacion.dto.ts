import { IsDate, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateSimulacionDto {
    @Type(() => Date) 
    @IsDate()
    fechaCreacion: Date;

    @IsString()
    nombreSimulacion: string;
}
