import { Injectable, Logger } from '@nestjs/common';
import { CreateDignidadDto } from './dto/create-dignidad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dignidad } from './entities/dignidad.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class DignidadService {
  private readonly logger = new Logger('DignidadService');

  constructor(
    @InjectRepository(Dignidad)
    private readonly dignidadRepository: Repository<Dignidad>,
    private readonly commonService: CommonService,
  ) {}

  async cargaMasivaDignidad(filePath: string): Promise<string> {
    return await this.commonService.loadExcelData<Dignidad, CreateDignidadDto>(
      filePath,
      CreateDignidadDto,
      this.dignidadRepository,
    );
  }

  async findAll() {
    return await this.dignidadRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} dignidad`;
  }

  async findAllMenu() {
    return await this.dignidadRepository
      .createQueryBuilder('dignidad')
      .select([
        'dignidad.idDignidad as id',
        'dignidad.nombreDignidad as nombre',
      ])
      .orderBy('dignidad.nombreDignidad', 'ASC')
      .getRawMany();
  }
}
