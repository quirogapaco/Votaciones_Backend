import {
  Controller,
  Post,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { PartidoService } from './partido.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('partido')
export class PartidoController {
  constructor(private readonly partidoService: PartidoService) {}

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
      await this.partidoService.cargaMasivaPartido(filePath);

      return 'Datos cargados correctamente';
    } catch (error) {
      console.error(error.message);
      throw new Error(
        `Error al procesar las zonas del archivo Excel: ${error.message}`,
      );
    }
  }

  @Get()
  async getPartidos() {
    return await this.partidoService.findAll();
  }
}
