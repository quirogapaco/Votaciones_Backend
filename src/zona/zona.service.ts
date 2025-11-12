import { Injectable } from '@nestjs/common';
import { CreateZonaDto } from './dto/create-zona.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Zona } from './entities/zona.entity';
import * as xlsx from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ZonaService {
  constructor(
    @InjectRepository(Zona)
    private zonaRepository: Repository<Zona>,
  ) {}

  async create(createZonaDto: CreateZonaDto): Promise<Zona> {
    const newZona = this.zonaRepository.create(createZonaDto);
    return await this.zonaRepository.save(newZona);
  }

  async findAll(): Promise<Zona[]> {
    return await this.zonaRepository.find();
  }

  async findOne(id: string): Promise<Zona> {
    return await this.zonaRepository.findOne({ where: { idZona: id } });
  }

  async loadExcelData(filePath: string): Promise<void> {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const [index, row] of data.entries()) {
      if (
        typeof row['nombreZona'] !== 'string' ||
        row['nombreZona'].trim() === ''
      ) {
        throw new Error(
          `Error en la fila ${index + 2}: nombreZona debe ser una cadena de texto válida.`,
        );
      }
      if (typeof row['codigoZona'] !== 'number') {
        throw new Error(
          `Error en la fila ${index + 2}: codigoZona debe ser un número válido.`,
        );
      }
    }

    const zonasDtos = data.map((row: any) =>
      plainToInstance(CreateZonaDto, {
        codigoZona: parseInt(row['codigoZona'], 10),
        nombreZona: row['nombreZona'],
      }),
    );

    for (const dto of zonasDtos) {
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new Error(`Error en la fila: ${JSON.stringify(errors)}`);
      }
    }

    const zonas = zonasDtos.map((dto) =>
      this.zonaRepository.create({
        codigoZona: dto.codigoZona,
        nombreZona: dto.nombreZona,
      }),
    );
    await this.zonaRepository.save(zonas);
  }

  async findAllMenu(): Promise<{ value: string; label: string }[]> {
    const zonas = await this.zonaRepository.find();
    return zonas.map((zona) => ({
      value: zona.idZona,
      label: zona.nombreZona,
    }));
  }
}
