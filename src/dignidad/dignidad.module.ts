import { Module } from '@nestjs/common';
import { DignidadService } from './dignidad.service';
import { DignidadController } from './dignidad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dignidad } from './entities/dignidad.entity';
import { Provincia } from 'src/provincia/entities/provincia.entity';
import { Canton } from 'src/canton/entities/canton.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dignidad]),
    CommonModule,
  ],
  controllers: [DignidadController],
  providers: [DignidadService],
})
export class DignidadModule {}
