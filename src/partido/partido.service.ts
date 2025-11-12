import { Injectable, Logger } from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { Partido } from './entities/partido.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PartidoService {
  private readonly logger = new Logger('PartidoService');

  constructor(
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    private readonly commonService: CommonService,
  ) {}

  async cargaMasivaPartido(filePath: string): Promise<string> {
    return await this.commonService.loadExcelData<Partido, CreatePartidoDto>(
      filePath,
      CreatePartidoDto,
      this.partidoRepository,
    );
  }

  async findAll() {
    return await this.partidoRepository.find();
  }
}
