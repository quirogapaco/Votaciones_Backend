import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parroquia } from './entities/parroquia.entity';
import { Repository } from 'typeorm';
import { Canton } from 'src/canton/entities/canton.entity';
import { Circunscripcion } from 'src/circunscripcion/entities/circunscripcion.entity';
import { CommonService } from 'src/common/common.service';
import { CreateParroquiaDto } from './dto/create-parroquia.dto';

@Injectable()
export class ParroquiaService {
  private readonly logger = new Logger('ParroquiaService');

  constructor(
    @InjectRepository(Parroquia)
    private readonly parroquiaRepository: Repository<Parroquia>,
    @InjectRepository(Canton)
    private readonly cantonRepository: Repository<Canton>,
    @InjectRepository(Circunscripcion)
    private readonly circunscripcionRepository: Repository<Circunscripcion>,
    private readonly commonService: CommonService,
  ) {}

  async findAllWithRelations(idCanton?: string, idCircunscripcion?: string) {
    if (!idCanton && !idCircunscripcion) {
      throw new BadRequestException(
        'Debe proporcionar al menos un parámetro: idCanton o idCircunscripcion',
      );
    }

    let parroquias: Parroquia[];

    if (idCircunscripcion && !idCanton) {
      throw new BadRequestException('Debe proporcionar el idCanton');
    } else if (idCircunscripcion && idCanton) {
      parroquias = await this.parroquiaRepository.find({
        where: { canton: { idCanton }, circunscripcion: { idCircunscripcion } },
      });
    } else {
      parroquias = await this.parroquiaRepository.find({
        where: { canton: { idCanton } },
      });
    }

    if (!parroquias.length) {
      throw new NotFoundException(
        'No se encontraron parroquias con los criterios dados',
      );
    }

    return parroquias;
  }

  async cargaMasivaParroquia(filePath: string): Promise<string> {
    return await this.commonService.loadExcelData<
      Parroquia,
      CreateParroquiaDto
    >(filePath, CreateParroquiaDto, this.parroquiaRepository, {
      canton: {
        repo: this.cantonRepository,
        field: 'codigoCanton',
      },
      circunscripcion: {
        repo: this.circunscripcionRepository,
        field: 'nombreCircunscripcion',
      },
    });
  }

  async findAll() {
    return await this.parroquiaRepository.find({
      relations: ['canton', 'circunscripcion'],
    });
  }

  async findAllMenu(idCanton?: string, idCircunscripcion?: string) {
    if (!idCanton && !idCircunscripcion) {
      throw new BadRequestException(
        'Debe proporcionar al menos un parámetro: idCanton o idCircunscripcion',
      );
    }

    if (idCircunscripcion && !idCanton) {
      throw new BadRequestException('Debe proporcionar el idCanton');
    }
    const parroquias = await this.parroquiaRepository.find({
      where: idCircunscripcion
        ? { canton: { idCanton }, circunscripcion: { idCircunscripcion } }
        : { canton: { idCanton } },
      select: {
        idParroquia: true,
        nombreParroquia: true,
      },
      order: {
        nombreParroquia: 'ASC',
      },
    });

    if (!parroquias.length) {
      throw new NotFoundException(
        'No se encontraron parroquias con los criterios dados',
      );
    }

    return parroquias.map((parroquia) => ({
      value: parroquia.idParroquia,
      label: parroquia.nombreParroquia,
    }));
  }
}
