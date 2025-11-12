import { Module } from '@nestjs/common';
import { CantonService } from './canton.service';
import { CantonController } from './canton.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Canton } from './entities/canton.entity';
import { Provincia } from 'src/provincia/entities/provincia.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Canton, Provincia]), CommonModule],
  controllers: [CantonController],
  providers: [CantonService],
})
export class CantonModule {}
