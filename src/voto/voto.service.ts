import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateVotoDto } from './dto/create-voto.dto';
import { UpdateVotoDto } from './dto/update-voto.dto';
import { In, Repository } from 'typeorm';
import { Voto } from './entities/voto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Junta } from 'src/junta/entities/junta.entity';
import { Simulacion } from 'src/simulacion/entities/simulacion.entity';
import { Candidato } from 'src/candidato/entities/candidato.entity';
import { privateDecrypt } from 'crypto';

@Injectable()
export class VotoService {
  private readonly logger = new Logger('VotoService');
  constructor(
    @InjectRepository(Voto)
    private readonly votoRepository: Repository<Voto>,
    @InjectRepository(Junta)
    private readonly juntaRepository: Repository<Junta>,
    @InjectRepository(Simulacion)
    private readonly simulacionRepository: Repository<Simulacion>,
    @InjectRepository(Candidato)
    private readonly candidatoRepository: Repository<Candidato>,

    private readonly commonService: CommonService,
  ){}
  
  async create(createVotoDto: CreateVotoDto) {
    try{
      const junta = await this.juntaRepository.findOne({where: {idJunta: createVotoDto.idJunta}});
      if(!junta){
        throw new BadRequestException(`Junta con id ${createVotoDto.idJunta} no encontrada`);
      }

      const candidato = await this.candidatoRepository.findOne({where: {idCandidato: createVotoDto.idCandidato}});
      if(!candidato){
        throw new BadRequestException(`Candidato con id ${createVotoDto.idCandidato} no encontrado`);
      }

      const simulacion = await this.simulacionRepository.findOne({where: {idSimulacion: createVotoDto.idSimulacion}});
      if(!simulacion){
        throw new BadRequestException(`Simulacion con id ${createVotoDto.idSimulacion} no encontrada`);
      }

      const voto = this.votoRepository.create(createVotoDto);
      await this.votoRepository.save(voto);
      return voto;
    }catch(e){
      this.commonService.handleDBExceptions(e, this.logger);
    }
  }

  async findAll() {
    return await this.votoRepository.find();
  }

  async findOne(id: string) {
    return await this.votoRepository.findOne({ where: { idVoto: id}});
  }

  async findVotoByForeignKeys(idCandidato: string, idSimulacion: string, idJunta: string) {
    const voto = await this.votoRepository.findOne({
      where: {
        candidato: { idCandidato },
        simulacion: { idSimulacion },
        junta: { idJunta },
      },
      relations: ['candidato', 'simulacion', 'junta'], 
    });

    if (!voto) {
      console.log(`No se encontró un voto con idCandidato=${idCandidato}, idSimulacion=${idSimulacion}, idJunta=${idJunta}`);
      return null;
    }

    return voto;
  }
  

  async upsertVoto(
    candidatos: { idCandidato: string, cantidad: number }[],
    idJunta: string,
    idSimulacion: string
  ) {
      const junta = await this.juntaRepository.findOne({ where: { idJunta } });
      const simulacion = await this.simulacionRepository.findOne({ where: { idSimulacion } });

      if (!junta || !simulacion) {
          throw new Error('Junta o Simulación no encontrada');
      }

      for (const candidatoData of candidatos) {
          const candidato = await this.candidatoRepository.findOne({ where: { idCandidato: candidatoData.idCandidato } });

          if (!candidato) {
              throw new Error(`Candidato con id ${candidatoData.idCandidato} no encontrado`);
          }

          let voto = await this.findVotoByForeignKeys(candidato.idCandidato, idSimulacion, idJunta);

          if (voto) {
              voto.cantidad = candidatoData.cantidad;
              console.log("Voto actualizado")
          } else {
              voto = this.votoRepository.create({
                  tipoVoto: "valido", 
                  cantidad: candidatoData.cantidad,
                  junta,
                  simulacion,
                  candidato,
              });
              console.log("Voto creado")
          }

          await this.votoRepository.save(voto);
      }
  }




  async updateCantidad(idCandidato: string, idSimulacion: string, idJunta: string, cantidad: number){
    const voto = await this.findVotoByForeignKeys(idCandidato, idSimulacion, idJunta);
    voto.cantidad = cantidad;
    await this.votoRepository.save(voto);
    return voto;
  }
}
