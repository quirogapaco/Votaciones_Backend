import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRecintoDto } from './dto/create-recinto.dto';
import { Recinto } from './entities/recinto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parroquia } from 'src/parroquia/entities/parroquia.entity';
import { Zona } from 'src/zona/entities/zona.entity';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class RecintoService {
  constructor(
    @InjectRepository(Recinto)
    private recintoRepository: Repository<Recinto>,
    @InjectRepository(Parroquia)
    private parroquiaRepository: Repository<Parroquia>,
    @InjectRepository(Zona)
    private zonaRepository: Repository<Zona>,
    private readonly commonService: CommonService,
  ) {}

  async cargaMasivaRecinto(filePath: string): Promise<string> {
    return await this.commonService.loadExcelData<Recinto, CreateRecintoDto>(
      filePath,
      CreateRecintoDto,
      this.recintoRepository,
      {
        parroquia: {
          repo: this.parroquiaRepository,
          field: 'codigoParroquia',
        },
        zona: {
          repo: this.zonaRepository,
          field: 'nombreZona',
        },
      },
    );
  }

  async findAllWithRelations(
    idZona?: string,
    idParroquia?: string,
  ): Promise<Recinto[]> {
    if (!idZona && !idParroquia) {
      throw new BadRequestException(
        'Debe proporcionar al menos un parámetro: idZona o idParroquia',
      );
    }

    let recintos: Recinto[];

    if (idParroquia && !idZona) {
      recintos = await this.recintoRepository.find({
        where: { parroquia: { idParroquia } },
      });
    } else if (idParroquia && idZona) {
      recintos = await this.recintoRepository.find({
        where: { parroquia: { idParroquia }, zona: { idZona } },
      });
    } else {
      recintos = await this.recintoRepository.find({
        where: { zona: { idZona } },
      });
    }

    if (!recintos.length) {
      throw new NotFoundException(
        'No se encontraron recintos con los criterios dados',
      );
    }

    return recintos;
  }

  async findAll(): Promise<Recinto[]> {
    return this.recintoRepository.find();
  }

  async findOne(id: string): Promise<Recinto> {
    const recinto = await this.recintoRepository.findOne({
      where: { idRecinto: id },
    });
    if (!recinto) {
      throw new NotFoundException(`Recinto con ID ${id} no encontrado`);
    }
    return recinto;
  }

  async findAllMenu(idZona?: string, idParroquia?: string) {
    if (!idZona && !idParroquia) {
      throw new BadRequestException(
        'Debe proporcionar al menos un parámetro: idZona o idParroquia',
      );
    }

    let recintos: Recinto[];

    if (idParroquia && !idZona) {
      recintos = await this.recintoRepository.find({
        where: { parroquia: { idParroquia } },
      });
    } else if (idParroquia && idZona) {
      recintos = await this.recintoRepository.find({
        where: { parroquia: { idParroquia }, zona: { idZona } },
      });
    } else {
      recintos = await this.recintoRepository.find({
        where: { zona: { idZona } },
      });
    }

    if (!recintos.length) {
      throw new NotFoundException(
        'No se encontraron recintos con los criterios dados',
      );
    }

    return recintos.map((recinto) => ({
      value: recinto.idRecinto,
      label: recinto.nombreRecinto,
    }));
  }
}
