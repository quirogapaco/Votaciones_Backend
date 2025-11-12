import { Module } from '@nestjs/common';
import { CircunscripcionService } from './circunscripcion.service';
import { CircunscripcionController } from './circunscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Circunscripcion } from './entities/circunscripcion.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Circunscripcion]), CommonModule],
  controllers: [CircunscripcionController],
  providers: [CircunscripcionService],
})
export class CircunscripcionModule {}
