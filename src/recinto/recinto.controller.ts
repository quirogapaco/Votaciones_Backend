import {
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RecintoService } from './recinto.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('recinto')
export class RecintoController {
  constructor(private readonly recintoService: RecintoService) {}

  @Get('relaciones')
  findAllWithRelations(
    @Query('idParroquia', new ParseUUIDPipe({ optional: true }))
    idParroquia?: string,
    @Query('idZona', new ParseUUIDPipe({ optional: true })) idZona?: string,
  ) {
    return this.recintoService.findAllWithRelations(idZona, idParroquia);
  }

  @Get('menu')
  findAllMenu(
    @Query('idParroquia', new ParseUUIDPipe({ optional: true }))
    idParroquia?: string,
    @Query('idZona', new ParseUUIDPipe({ optional: true })) idZona?: string,
  ) {
    return this.recintoService.findAllMenu(idZona, idParroquia);
  }

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
      await this.recintoService.cargaMasivaRecinto(filePath);

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
    return this.recintoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recintoService.findOne(id);
  }
}
