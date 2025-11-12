import { Module } from '@nestjs/common';
import { ZonaService } from './zona.service';
import { ZonaController } from './zona.controller';
import { Zona } from './entities/zona.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Zona])],
  controllers: [ZonaController],
  providers: [ZonaService],
})
export class ZonaModule {}
