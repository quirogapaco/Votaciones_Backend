import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCandidatoDto } from './dto/create-candidato.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidato } from './entities/candidato.entity';
import { In, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { Partido } from 'src/partido/entities/partido.entity';
import { Dignidad } from 'src/dignidad/entities/dignidad.entity';
import { Provincia } from 'src/provincia/entities/provincia.entity';
import { Circunscripcion } from 'src/circunscripcion/entities/circunscripcion.entity';
import { Junta } from 'src/junta/entities/junta.entity';
import { Voto } from 'src/voto/entities/voto.entity';

@Injectable()
export class CandidatoService {
  private readonly logger = new Logger('CandidatoService');

  constructor(
    @InjectRepository(Candidato)
    private readonly candidatoRepository: Repository<Candidato>,
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    @InjectRepository(Dignidad)
    private readonly dignidadRepository: Repository<Dignidad>,
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
    @InjectRepository(Circunscripcion)
    private readonly circunscripcionRepository: Repository<Circunscripcion>,
    @InjectRepository(Junta)
    private readonly juntaRepository: Repository<Junta>,
    @InjectRepository(Voto)
    private readonly votoRepository: Repository<Voto>,

    private readonly commonService: CommonService,
  ) {}

  async cargaMasivaCandidato(filePath: string): Promise<string> {
    return await this.commonService.loadExcelData<
      Candidato,
      CreateCandidatoDto
    >(filePath, CreateCandidatoDto, this.candidatoRepository, {
      dignidad: {
        repo: this.dignidadRepository,
        field: 'codigoDignidad',
      },
      partido: {
        repo: this.partidoRepository,
        field: 'numPartido',
      },
      provincia: {
        repo: this.provinciaRepository,
        field: 'codigoProvincia',
      },
      circunscripcion: {
        repo: this.circunscripcionRepository,
        field: 'nombreCircunscripcion',
      },
    });
  }

  async findcandidatoscConRelaciones(
    idDignidad: string,
    idCircunscripcion?: string,
    idProvincia?: string,
  ) {
    if (!idDignidad) {
      throw new BadRequestException(
        'Debe proporcionar idDignidad como parámetro',
      );
    }

    let candidatos: Candidato[];
    const relations = ['partido', 'provincia']; // Añadimos provincia a las relaciones

    if (idProvincia && !idCircunscripcion) {
      candidatos = await this.candidatoRepository.find({
        where: {
          dignidad: { idDignidad },
          provincia: { idProvincia },
        },
        relations,
      });
    } else if (idProvincia && idCircunscripcion) {
      candidatos = await this.candidatoRepository.find({
        where: {
          dignidad: { idDignidad },
          provincia: { idProvincia },
          circunscripcion: { idCircunscripcion },
        },
        relations,
      });
    } else if (!idProvincia && idCircunscripcion) {
      candidatos = await this.candidatoRepository.find({
        where: {
          dignidad: { idDignidad },
          circunscripcion: { idCircunscripcion },
        },
        relations,
      });
    } else {
      candidatos = await this.candidatoRepository.find({
        where: { dignidad: { idDignidad } },
        relations,
      });
    }

    if (!candidatos.length) {
      throw new NotFoundException(
        'No se encontraron candidatos con los criterios dados',
      );
    }

    // Agrupar por partido con estructura simplificada
    const candidatosPorPartido = candidatos.reduce((acc, candidato) => {
      const partidoId = candidato.partido.idPartido;
      if (!acc[partidoId]) {
        acc[partidoId] = {
          idPartido: candidato.partido.idPartido,
          nombrePartido: candidato.partido.nombrePartido,
          numPartido: candidato.partido.numPartido,
          candidatos: [],
        };
      }
      // Solo incluimos los campos necesarios y manejamos el caso null de provincia
      const candidatoSimplificado = {
        idCandidato: candidato.idCandidato,
        nombreCandidato: candidato.nombreCandidato,
        idProvincia: candidato.provincia?.idProvincia || null,
        fotoCandidato: candidato.fotoCandidato || null,
      };
      acc[partidoId].candidatos.push(candidatoSimplificado);
      return acc;
    }, {});

    return Object.values(candidatosPorPartido);
  }

  async votosPorCandidato(
    idDignidad: string,
    idRecinto: string,
    idSimulacion: string,
    idCircunscripcion?: string,
    idProvincia?: string,
  ) {
    if (!idDignidad) {
      throw new BadRequestException(
        'Debe proporcionar idDignidad como parámetro',
      );
    }
    if (!idRecinto) {
      throw new BadRequestException(
        'Debe proporcionar idRecinto como parámetro',
      );
    }

    let candidatos: Candidato[];
    const relations = ['partido'];

    if (idProvincia && !idCircunscripcion) {
      candidatos = await this.candidatoRepository.find({
        where: {
          dignidad: { idDignidad },
          provincia: { idProvincia },
        },
        relations,
      });
    } else if (idProvincia && idCircunscripcion) {
      candidatos = await this.candidatoRepository.find({
        where: {
          dignidad: { idDignidad },
          provincia: { idProvincia },
          circunscripcion: { idCircunscripcion },
        },
        relations,
      });
    } else if (!idProvincia && idCircunscripcion) {
      candidatos = await this.candidatoRepository.find({
        where: {
          dignidad: { idDignidad },
          circunscripcion: { idCircunscripcion },
        },
        relations,
      });
    } else {
      candidatos = await this.candidatoRepository.find({
        where: { dignidad: { idDignidad } },
        relations,
      });
    }

    if (!candidatos.length) {
      throw new NotFoundException(
        'No se encontraron candidatos con los criterios dados',
      );
    }

    // Obtener juntas del recinto
    const juntas = await this.juntaRepository.find({
      where: { recinto: { idRecinto } },
    });

    // Construir la estructura del JSON
    const resultado = [];

    for (const junta of juntas) {
      // Inicializar la estructura de la junta
      const juntaData = {
        idJunta: junta.idJunta,
        numJunta: junta.numJunta,
        genero: junta.genero,
        partidos: [],
      };

      // Agrupar candidatos por partido
      const partidosMap = new Map<string, any>();
      for (const candidato of candidatos) {
        const idPartido = candidato.partido?.idPartido || 'SIN_PARTIDO';
        if (!partidosMap.has(idPartido)) {
          partidosMap.set(idPartido, {
            idPartido: idPartido === 'SIN_PARTIDO' ? null : idPartido,
            nombrePartido: candidato.partido?.nombrePartido || 'Sin Partido',
            candidatos: [],
          });
        }

        var voto = await this.votoRepository.findOne({
          where: {
            candidato: { idCandidato: candidato.idCandidato },
            junta: { idJunta: junta.idJunta },
            simulacion: { idSimulacion: idSimulacion },
          },
        });

        let numVotos;

        if (voto) {
          numVotos = voto.cantidad;
        } else {
          numVotos = 0;
        }

        // Agregar el candidato al partido
        partidosMap.get(idPartido).candidatos.push({
          idCandidato: candidato.idCandidato,
          nombreCandidato: candidato.nombreCandidato,
          numVotos: numVotos,
        });
      }

      // Agregar los partidos a la junta
      juntaData.partidos = Array.from(partidosMap.values());
      resultado.push(juntaData);
    }

    return resultado;
  }

  async votosCandidatoJunta(
    candidatos: string[],
    juntas: string[],
    idSimulacion: string,
  ) {
    if (!candidatos.length) {
      throw new BadRequestException(
        'Debe proporcionar candidatos como parámetro',
      );
    }
    if (!juntas.length) {
      throw new BadRequestException('Debe proporcionar idJunta como parámetro');
    }
    if (!idSimulacion) {
      throw new BadRequestException(
        'Debe proporcionar idSimulacion como parámetro',
      );
    }

    const votos = await this.votoRepository.find({
      where: {
        candidato: { idCandidato: In(candidatos) },
        junta: { idJunta: In(juntas) },
        simulacion: { idSimulacion },
      },
      relations: ['candidato', 'junta'],
    });

    const resultado = juntas.map((junta) => ({
      idJunta: junta,
      candidatos: candidatos.map((candidato) => {
        const votoEncontrado = votos.find(
          (voto) =>
            voto.candidato.idCandidato === candidato &&
            voto.junta.idJunta === junta,
        );
        return {
          idCandidato: candidato,
          numVotos: votoEncontrado ? votoEncontrado.cantidad : 0,
        };
      }),
    }));

    return resultado;
  }
}
