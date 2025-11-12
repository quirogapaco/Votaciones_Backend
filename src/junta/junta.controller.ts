import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JuntaService } from './junta.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('junta')
export class JuntaController {
  constructor(private readonly juntaService: JuntaService) {}

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
      await this.juntaService.cargaMasivaJunta(filePath);

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
    return this.juntaService.findAll();
  }

  @Get('recinto')
  findAllByRecinto(@Query('idRecinto', new ParseUUIDPipe()) idRecinto: string) {
    return this.juntaService.findAllByRecinto(idRecinto);
  }

  @Get('menu')
  findAllMenu(@Query('idRecinto', new ParseUUIDPipe()) idRecinto: string) {
    return this.juntaService.findAllMenu(idRecinto);
  }
}
