import { Module } from '@nestjs/common';
import { CandidatoService } from './candidato.service';
import { CandidatoController } from './candidato.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidato } from './entities/candidato.entity';
import { Partido } from 'src/partido/entities/partido.entity';
import { Dignidad } from 'src/dignidad/entities/dignidad.entity';
import { CommonModule } from 'src/common/common.module';
import { Provincia } from 'src/provincia/entities/provincia.entity';
import { Circunscripcion } from 'src/circunscripcion/entities/circunscripcion.entity';
import { Junta } from 'src/junta/entities/junta.entity';
import { Voto } from 'src/voto/entities/voto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidato, Partido, Dignidad, Provincia, Circunscripcion, Junta, Voto]), 
  CommonModule],
  controllers: [CandidatoController],
  providers: [CandidatoService],
})
export class CandidatoModule {}
