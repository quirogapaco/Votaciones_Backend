import {
  Controller,
  Post,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Get,
  Query,
  ParseUUIDPipe,
  Body,
} from '@nestjs/common';
import { CandidatoService } from './candidato.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('candidato')
export class CandidatoController {
  constructor(private readonly candidatoService: CandidatoService) {}

  @Post('excel')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../../uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('No se ha subido ningún archivo');
      }

      const filePath = file.path;
      await this.candidatoService.cargaMasivaCandidato(filePath);

      return 'Datos cargados correctamente';
    } catch (error) {
      console.error(error.message);
      throw new Error(
        `Error al procesar las zonas del archivo Excel: ${error.message}`,
      );
    }
  }

  @Get('menu')
  findcandidatoscConRelaciones(
    @Query('idDignidad', new ParseUUIDPipe({ optional: false }))
    idDignidad: string,
    @Query('idCircunscripcion', new ParseUUIDPipe({ optional: true }))
    idCircunscripcion?: string,
    @Query('idProvincia', new ParseUUIDPipe({ optional: true }))
    idProvincia?: string,
  ) {
    return this.candidatoService.findcandidatoscConRelaciones(
      idDignidad,
      idCircunscripcion,
      idProvincia,
    );
  }

  @Get('/menuCandidatos')
  findcandidatoscMenu(
    @Query('idDignidad', new ParseUUIDPipe({ optional: false }))
    idDignidad: string,
    @Query('idRecinto', new ParseUUIDPipe({ optional: false }))
    idRecinto: string,
    @Query('idSimulacion', new ParseUUIDPipe({ optional: false }))
    idSimulacion: string,
    @Query('idCircunscripcion', new ParseUUIDPipe({ optional: true }))
    idCircunscripcion?: string,
    @Query('idProvincia', new ParseUUIDPipe({ optional: true }))
    idProvincia?: string,
  ) {
    return this.candidatoService.votosPorCandidato(
      idDignidad,
      idRecinto,
      idSimulacion,
      idCircunscripcion,
      idProvincia,
    );
  }

  @Get('/votosCandidatoJunta')
  findVotosCandidatoJunta(
    @Query('candidatos') candidatos: string | string[],
    @Query('juntas') juntas: string | string[],
    @Query('idSimulacion', new ParseUUIDPipe({ optional: false }))
    idSimulacion: string,
  ) {
    // Convierte candidatos y juntas en arrays si no lo son
    const candidatosArray = Array.isArray(candidatos)
      ? candidatos
      : [candidatos];
    const juntasArray = Array.isArray(juntas) ? juntas : [juntas];

    return this.candidatoService.votosCandidatoJunta(
      candidatosArray,
      juntasArray,
      idSimulacion,
    );
  }

  @Post('/votosCandidatoJunta')
  findVotosCandidatoJuntaPost(
    @Body('candidatos') candidatos: string | string[],
    @Body('juntas') juntas: string | string[],
    @Body('idSimulacion', new ParseUUIDPipe({ optional: false }))
    idSimulacion: string,
  ) {
    // Convierte candidatos y juntas en arrays si no lo son
    const candidatosArray = Array.isArray(candidatos)
      ? candidatos
      : [candidatos];
    const juntasArray = Array.isArray(juntas) ? juntas : [juntas];

    return this.candidatoService.votosCandidatoJunta(
      candidatosArray,
      juntasArray,
      idSimulacion,
    );
  }
}
