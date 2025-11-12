import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SimulacionService } from './simulacion.service';
import { UpdateSimulacionDto } from './dto/update-simulacion.dto';

@Controller('simulacion')
export class SimulacionController {
  constructor(private readonly simulacionService: SimulacionService) {}

  @Post()
  create(@Body('nombreSimulacion') nombreSimulacion: string) {
    return this.simulacionService.create(nombreSimulacion);
    
  }

  @Get('/activa')
  simulacionActiva(){
    return this.simulacionService.findSimulacionActiva();
  }

  @Patch('/terminarSimulacion/:id')
  terminarSimulacion(@Param('id') id: string){
    return this.simulacionService.terminarSimulacion(id);
  }

  @Patch('/activarSimulacion/:id')
  activarSimulacion(@Param('id') id: string){
    return this.simulacionService.activarSimulacion(id);
  }

  @Get()
  findAll() {
    return this.simulacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSimulacionDto: UpdateSimulacionDto) {
    return this.simulacionService.update(+id, updateSimulacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simulacionService.remove(+id);
  }
}
