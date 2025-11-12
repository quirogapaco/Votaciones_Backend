import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CommonService } from 'src/common/common.service';
import { Circunscripcion } from './entities/circunscripcion.entity';
import { CreateCircunscripcionDto } from './dto/create-circunscripcion.dto';

@Injectable()
export class CircunscripcionService {
  private readonly logger = new Logger('CircunscripcionService');
  constructor(
    @InjectRepository(Circunscripcion)
    private readonly circunscripcionRepository: Repository<Circunscripcion>,
    private readonly commonService: CommonService,
  ) {}

  async cargaMasivaCircunscripcion(filePath: string): Promise<string> {
    return await this.commonService.loadExcelData<
      Circunscripcion,
      CreateCircunscripcionDto
    >(filePath, CreateCircunscripcionDto, this.circunscripcionRepository);
  }

  async create(createCircunscripcionDto: CreateCircunscripcionDto) {
    try {
      const circunscripcion = this.circunscripcionRepository.create(
        createCircunscripcionDto,
      );
      await this.circunscripcionRepository.save(circunscripcion);
      return circunscripcion;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return await this.circunscripcionRepository.find();
  }

  async findAllMenu() {
    return await this.circunscripcionRepository
      .createQueryBuilder('circunscripcion')
      .select([
        'circunscripcion.idCircunscripcion as value',
        'circunscripcion.nombreCircunscripcion as label',
      ])
      .orderBy('circunscripcion.nombreCircunscripcion', 'ASC')
      .getRawMany();
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, revisar los logs del servidor',
    );
  }
}
