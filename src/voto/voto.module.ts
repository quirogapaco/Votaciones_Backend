import { Module } from '@nestjs/common';
import { VotoService } from './voto.service';
import { VotoController } from './voto.controller';
import { Voto } from './entities/voto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Junta } from 'src/junta/entities/junta.entity';
import { Simulacion } from 'src/simulacion/entities/simulacion.entity';
import { Candidato } from 'src/candidato/entities/candidato.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Voto, Junta, Simulacion, Candidato]),
  CommonModule],
  controllers: [VotoController],
  providers: [VotoService],
})
export class VotoModule {}
