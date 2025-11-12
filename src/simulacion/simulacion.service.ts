import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { UpdateSimulacionDto } from './dto/update-simulacion.dto';
import { Repository } from 'typeorm';
import { Simulacion } from './entities/simulacion.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SimulacionService {
  private readonly logger = new Logger('SimulacionService');
  constructor(
    @InjectRepository(Simulacion)
    private readonly simulacionRepository: Repository<Simulacion>,
   ) {}

  async create(nombreSimulacion: string) {
    try{
      const simulacion = this.simulacionRepository.create(
        {
          nombreSimulacion: nombreSimulacion,
          estado: true,
          fechaCreacion: new Date()
        }
      );
      await this.simulacionRepository.save(simulacion);
      return simulacion;
    }catch(e){
      this.handleDBExceptions(e);
    }
    
    return 'This action adds a new simulacion';
  }

  async findSimulacionActiva(){
    return await this.simulacionRepository.findOne({where: {estado: true}});
  }

  async terminarSimulacion(id: string){
    console.log(id);
    const simulacion = await this.simulacionRepository.findOne({where: {idSimulacion: id}});

    if(simulacion){
      simulacion.estado = false;
      await this.simulacionRepository.save(simulacion);
      return simulacion;
    }else{
    throw new BadRequestException("No se encontro la simulacion");
    }
  }

  async activarSimulacion(id: string){
    console.log(id);
    const simulacion = await this.simulacionRepository.findOne({where: {idSimulacion: id}});

    if(simulacion){
      simulacion.estado = true;
      await this.simulacionRepository.save(simulacion);
      return simulacion;
    }else{
    throw new BadRequestException("No se encontro la simulacion");
    }
  }

  async findAll() {
    return await this.simulacionRepository.find();
  }

  async findOne(id: string) {
    return this.simulacionRepository.findOne({where: {idSimulacion: id}});
  }

  

  update(id: number, updateSimulacionDto: UpdateSimulacionDto) {
    return `This action updates a #${id} simulacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} simulacion`;
  }

  private handleDBExceptions(error: any) {
      if (error.code === '23505') throw new BadRequestException(error.detail);
  
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error inesperado, revisar los logs del servidor',
      );
    }
}
