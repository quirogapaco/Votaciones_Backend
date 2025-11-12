import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import * as xlsx from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CommonService {
  async loadExcelData<T extends object, D extends DeepPartial<T>>(
    filePath: string,
    dtoClass: new () => D,
    repository: Repository<T>,
    relations?: {
      [key: string]: {
        repo: Repository<any>;
        field: string; // Campo clave para la búsqueda
      };
    },
  ): Promise<string> {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Convertir cada fila al DTO
    const dtos = data.map((row: any) => plainToInstance(dtoClass, row));

    for (const dto of dtos) {
      // Resolver relaciones, si se proporcionaron
      if (relations) {
        for (const [key, { repo, field }] of Object.entries(relations)) {
          if (dto[field]) {
            // Usar el campo especificado para buscar la entidad relacionada
            const relatedEntity = await repo.findOneBy({ [field]: dto[field] });
            if (!relatedEntity) {
              throw new Error(
                `La relación '${key}' con valor '${dto[field]}' no existe.`,
              );
            }
            dto[key] = relatedEntity; // Sustituye el valor por la entidad completa
          }
        }
      }

      // Validar el DTO
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new Error(`Error en la fila: ${JSON.stringify(errors)}`);
      }
    }

    try {
      // Crear y guardar entidades
      const entities = dtos.map((dto) => repository.create(dto));
      await repository.save(entities);
      return 'Datos cargados correctamente';
    } catch (error) {
      throw new Error(`Error al guardar datos: ${error.message}`);
    }
  }

  public handleDBExceptions(error: any, logger:Logger) {
        if (error.code === '23505') throw new BadRequestException(error.detail);
    
        logger.error(error);
        throw new InternalServerErrorException(
          'Error inesperado, revisar los logs del servidor',
        );
      }
}
