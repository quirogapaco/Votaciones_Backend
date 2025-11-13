import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Provincia } from '../provincia/entities/provincia.entity';
import * as bcryptjs from 'bcryptjs';
import { ProvinciaService } from '../provincia/provincia.service';
import { CantonService } from '../canton/canton.service';
import { ParroquiaService } from '../parroquia/parroquia.service';
import { ZonaService } from '../zona/zona.service';
import { RecintoService } from '../recinto/recinto.service';
import { JuntaService } from '../junta/junta.service';
import { CircunscripcionService } from '../circunscripcion/circunscripcion.service';
import { DignidadService } from '../dignidad/dignidad.service';
import { PartidoService } from '../partido/partido.service';
import { CandidatoService } from '../candidato/candidato.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
    private readonly provinciaService: ProvinciaService,
    private readonly cantonService: CantonService,
    private readonly parroquiaService: ParroquiaService,
    private readonly zonaService: ZonaService,
    private readonly recintoService: RecintoService,
    private readonly juntaService: JuntaService,
    private readonly circunscripcionService: CircunscripcionService,
    private readonly dignidadService: DignidadService,
    private readonly partidoService: PartidoService,
    private readonly candidatoService: CandidatoService,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
    // Las cargas masivas se ejecutarán automáticamente si la tabla provincia está vacía
    await this.seedMassiveData();
  }

  private async seedUsers() {
    try {
      const usersCount = await this.userRepository.count();
      
      if (usersCount > 0) {
        this.logger.log('Los usuarios ya están creados. Omitiendo seed de usuarios.');
        return;
      }

      this.logger.log('Creando usuarios iniciales...');

      const users = [
        {
          nombre: 'Admin',
          apellido: 'Sistema',
          email: 'admin@votaciones.com',
          password: await bcryptjs.hash('admin123', 10),
          rol: 'Administrador',
        },
        {
          nombre: 'Registrador',
          apellido: 'Uno',
          email: 'registrador1@votaciones.com',
          password: await bcryptjs.hash('registro123', 10),
          rol: 'Registrador',
        },
        {
          nombre: 'Registrador',
          apellido: 'Dos',
          email: 'registrador2@votaciones.com',
          password: await bcryptjs.hash('registro123', 10),
          rol: 'Registrador',
        },
      ];

      for (const userData of users) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
        this.logger.log(`Usuario creado: ${userData.email} (${userData.rol})`);
      }

      this.logger.log('✅ Usuarios iniciales creados correctamente');
      this.logger.log('📧 Credenciales:');
      this.logger.log('   Admin: admin@votaciones.com / admin123');
      this.logger.log('   Registrador 1: registrador1@votaciones.com / registro123');
      this.logger.log('   Registrador 2: registrador2@votaciones.com / registro123');
    } catch (error) {
      this.logger.error(`❌ Error al crear usuarios: ${error.message}`);
    }
  }

  async seedMassiveData() {
    try {
      // Verificar si ya existen datos en la tabla provincia
      const provinciasCount = await this.provinciaRepository.count();
      
      if (provinciasCount > 0) {
        this.logger.log('✅ Ya existen datos cargados (tabla provincia no está vacía). Omitiendo carga masiva.');
        return;
      }

      this.logger.log('🚀 Iniciando carga masiva de datos...');

      const assetsPath = path.join(process.cwd(), 'assets');

      // Verificar que la carpeta assets existe
      if (!fs.existsSync(assetsPath)) {
        this.logger.warn('⚠️  Carpeta assets no encontrada. Omitiendo carga masiva.');
        return;
      }

      const files = [
        { name: 'PROVINCIAS.xlsx', service: this.provinciaService, method: 'cargaMasivaProvincia' },
        { name: 'CANTONES.xlsx', service: this.cantonService, method: 'cargaMasivaCanton' },
        { name: 'CIRCUNSCRIPCIONES.xlsx', service: this.circunscripcionService, method: 'cargaMasivaCircunscripcion' },
        { name: 'PARROQUIAS.xlsx', service: this.parroquiaService, method: 'cargaMasivaParroquia' },
        { name: 'ZONAS.xlsx', service: this.zonaService, method: 'loadExcelData' },
        { name: 'RECINTOS.xlsx', service: this.recintoService, method: 'cargaMasivaRecinto' },
        { name: 'JUNTAS.xlsx', service: this.juntaService, method: 'cargaMasivaJunta' },
        { name: 'DIGNIDADES.xlsx', service: this.dignidadService, method: 'cargaMasivaDignidad' },
        { name: 'PARTIDOS.xlsx', service: this.partidoService, method: 'cargaMasivaPartido' },
        { name: 'Candidatos.xlsx', service: this.candidatoService, method: 'cargaMasivaCandidato' },
      ];

      for (const file of files) {
        const filePath = path.join(assetsPath, file.name);

        if (!fs.existsSync(filePath)) {
          this.logger.warn(`⚠️  Archivo ${file.name} no encontrado. Omitiendo...`);
          continue;
        }

        try {
          this.logger.log(`📄 Procesando ${file.name}...`);
          await file.service[file.method](filePath);
          this.logger.log(`✅ ${file.name} cargado correctamente`);
        } catch (error) {
          this.logger.error(`❌ Error al cargar ${file.name}: ${error.message}`);
        }
      }

      this.logger.log('🎉 Carga masiva completada');
    } catch (error) {
      this.logger.error(`❌ Error en carga masiva: ${error.message}`);
    }
  }
}
