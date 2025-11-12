import { Module } from '@nestjs/common';
import { SimulacionService } from './simulacion.service';
import { SimulacionController } from './simulacion.controller';
import { Simulacion } from './entities/simulacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Simulacion])],
  controllers: [SimulacionController],
  providers: [SimulacionService],
})
export class SimulacionModule {}
