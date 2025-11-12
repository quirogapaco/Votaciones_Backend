// recinto.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecintoService } from './recinto.service';
import { RecintoController } from './recinto.controller';
import { Recinto } from './entities/recinto.entity';
import { Parroquia } from '../parroquia/entities/parroquia.entity';
import { Zona } from '../zona/entities/zona.entity';
import { CommonModule } from '../common/common.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Recinto, Parroquia, Zona]), CommonModule],
  controllers: [RecintoController],
  providers: [RecintoService],
})
export class RecintoModule {}
