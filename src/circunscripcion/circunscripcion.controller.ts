import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CircunscripcionService } from './circunscripcion.service';
import { CreateCircunscripcionDto } from './dto/create-circunscripcion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('circunscripcion')
export class CircunscripcionController {
  constructor(
    private readonly circunscripcionService: CircunscripcionService,
  ) {}

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
      await this.circunscripcionService.cargaMasivaCircunscripcion(filePath);

      return 'Datos cargados correctamente';
    } catch (error) {
      console.error(error.message);
      throw new Error(
        `Error al procesar las zonas del archivo Excel: ${error.message}`,
      );
    }
  }

  @Post()
  create(@Body() createCircunscripcionDto: CreateCircunscripcionDto) {
    return this.circunscripcionService.create(createCircunscripcionDto);
  }

  @Get()
  findAll() {
    return this.circunscripcionService.findAll();
  }

  @Get('menu')
  findAllMenu() {
    return this.circunscripcionService.findAllMenu();
  }
}
