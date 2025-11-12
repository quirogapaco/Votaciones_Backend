import { Module } from '@nestjs/common';
import { ParroquiaService } from './parroquia.service';
import { ParroquiaController } from './parroquia.controller';
import { Parroquia } from './entities/parroquia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Canton } from 'src/canton/entities/canton.entity';
import { Circunscripcion } from 'src/circunscripcion/entities/circunscripcion.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parroquia, Canton, Circunscripcion]),
    CommonModule,
  ],
  controllers: [ParroquiaController],
  providers: [ParroquiaService],
})
export class ParroquiaModule {}
