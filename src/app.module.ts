import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProvinciaModule } from './provincia/provincia.module';
import { CantonModule } from './canton/canton.module';
import { CircunscripcionModule } from './circunscripcion/circunscripcion.module';
import { ParroquiaModule } from './parroquia/parroquia.module';
import { RecintoModule } from './recinto/recinto.module';
import { ZonaModule } from './zona/zona.module';
import { JuntaModule } from './junta/junta.module';
import { VotoModule } from './voto/voto.module';
import { CandidatoModule } from './candidato/candidato.module';
import { DignidadModule } from './dignidad/dignidad.module';
import { PartidoModule } from './partido/partido.module';
import { SimulacionModule } from './simulacion/simulacion.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl:
          process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, //! TODO: Eliminar cuando se pase a producción
    }),
    ProvinciaModule,
    CantonModule,
    CircunscripcionModule,
    ParroquiaModule,
    RecintoModule,
    ZonaModule,
    JuntaModule,
    VotoModule,
    CandidatoModule,
    DignidadModule,
    PartidoModule,
    SimulacionModule,
    CommonModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
