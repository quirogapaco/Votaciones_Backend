import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { Provincia } from './entities/provincia.entity';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class ProvinciaService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
    private readonly commonService: CommonService,
  ) {}

  async cargaMasivaProvincia(filePath: string): Promise<string> {
    return await this.commonService.loadExcelData<
      Provincia,
      CreateProvinciaDto
    >(filePath, CreateProvinciaDto, this.provinciaRepository);
  }

  async create(createProvinciaDto: CreateProvinciaDto) {
    try {
      const provincia = this.provinciaRepository.create(createProvinciaDto);
      await this.provinciaRepository.save(provincia);
      return provincia;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return await this.provinciaRepository.find();
  }

  async findAllMenu() {
    return await this.provinciaRepository
      .createQueryBuilder('provincia')
      .select([
        'provincia.idProvincia as value',
        'provincia.nombreProvincia as label',
      ])
      .orderBy('provincia.nombreProvincia', 'ASC')
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
