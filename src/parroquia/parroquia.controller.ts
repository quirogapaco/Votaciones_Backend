import {
  Controller,
  Get,
  Post,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ParroquiaService } from './parroquia.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('parroquia')
export class ParroquiaController {
  constructor(private readonly parroquiaService: ParroquiaService) {}

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
      await this.parroquiaService.cargaMasivaParroquia(filePath);

      return 'Datos cargados correctamente';
    } catch (error) {
      console.error(error.message);
      throw new Error(
        `Error al procesar las zonas del archivo Excel: ${error.message}`,
      );
    }
  }

  @Get()
  findAll() {
    return this.parroquiaService.findAll();
  }

  @Get('relaciones')
  findAllWithRelations(
    @Query('idCanton', new ParseUUIDPipe({ optional: true })) idCanton?: string,
    @Query('idCircunscripcion', new ParseUUIDPipe({ optional: true }))
    idCircunscripcion?: string,
  ) {
    return this.parroquiaService.findAllWithRelations(
      idCanton,
      idCircunscripcion,
    );
  }

  @Get('menu')
  findAllMenu(
    @Query('idCanton', new ParseUUIDPipe({ optional: true })) idCanton?: string,
    @Query('idCircunscripcion', new ParseUUIDPipe({ optional: true }))
    idCircunscripcion?: string,
  ) {
    return this.parroquiaService.findAllMenu(idCanton, idCircunscripcion);
  }
}
