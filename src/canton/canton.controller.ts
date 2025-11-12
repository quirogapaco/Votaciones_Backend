import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CantonService } from './canton.service';
import { CreateCantonDto } from './dto/create-canton.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('canton')
export class CantonController {
  constructor(private readonly cantonService: CantonService) {}

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
      await this.cantonService.cargaMasivaCanton(filePath);

      return 'Datos cargados correctamente';
    } catch (error) {
      console.error(error.message);
      throw new Error(
        `Error al procesar las zonas del archivo Excel: ${error.message}`,
      );
    }
  }

  @Post()
  create(@Body() createCantonDto: CreateCantonDto) {
    return this.cantonService.create(createCantonDto);
  }

  @Get()
  findAll() {
    return this.cantonService.findAll();
  }

  @Get('menu')
  findAllMenu(@Query('idProvincia', ParseUUIDPipe) idProvincia: string) {
    return this.cantonService.findAllMenu(idProvincia);
  }

  @Get(':idProvincia')
  findAllWithProvincia(
    @Query('idProvincia', ParseUUIDPipe) idProvincia: string,
  ) {
    return this.cantonService.findByProvincia(idProvincia);
  }
}
