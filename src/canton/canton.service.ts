import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCantonDto } from './dto/create-canton.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Canton } from './entities/canton.entity';
import { Repository } from 'typeorm';
import { Provincia } from 'src/provincia/entities/provincia.entity';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class CantonService {
  private readonly logger = new Logger('CantonService');

  constructor(
    @InjectRepository(Canton)
    private readonly cantonRepository: Repository<Canton>,
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
    private readonly commonService: CommonService,
  ) {}

  async cargaMasivaCanton(filePath: string): Promise<string> {
    return await this.commonService.loadExcelData<Canton, CreateCantonDto>(
      filePath,
      CreateCantonDto,
      this.cantonRepository,
      {
        provincia: {
          repo: this.provinciaRepository,
          field: 'codigoProvincia',
        },
      },
    );
  }

  async create(createCantonDto: CreateCantonDto) {
    try {
      const provincia = await this.provinciaRepository.findOneBy({
        codigoProvincia: createCantonDto.codigoProvincia,
      });

      if (!provincia) {
        throw new Error('Provincia no encontrada');
      }

      const canton = this.cantonRepository.create({
        ...createCantonDto,
        provincia,
      });

      await this.cantonRepository.save(canton);
      return canton;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return await this.cantonRepository.find();
  }

  async findByProvincia(idProvincia: string) {
    return await this.cantonRepository.find({
      where: { provincia: { idProvincia } },
    });
  }

  async findAllMenu(idProvincia: string) {
    return await this.cantonRepository
      .createQueryBuilder('canton')
      .select(['canton.idCanton as value', 'canton.nombreCanton as label'])
      .where('canton.idProvincia = :idProvincia', { idProvincia })
      .orderBy('canton.nombreCanton', 'ASC')
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
