import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Provincia } from '../provincia/entities/provincia.entity';
import { ProvinciaModule } from '../provincia/provincia.module';
import { CantonModule } from '../canton/canton.module';
import { ParroquiaModule } from '../parroquia/parroquia.module';
import { ZonaModule } from '../zona/zona.module';
import { RecintoModule } from '../recinto/recinto.module';
import { JuntaModule } from '../junta/junta.module';
import { CircunscripcionModule } from '../circunscripcion/circunscripcion.module';
import { DignidadModule } from '../dignidad/dignidad.module';
import { PartidoModule } from '../partido/partido.module';
import { CandidatoModule } from '../candidato/candidato.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Provincia]),
    ProvinciaModule,
    CantonModule,
    ParroquiaModule,
    ZonaModule,
    RecintoModule,
    JuntaModule,
    CircunscripcionModule,
    DignidadModule,
    PartidoModule,
    CandidatoModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
