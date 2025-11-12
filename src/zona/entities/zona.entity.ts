import { Recinto } from 'src/recinto/entities/recinto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Zona {
  @PrimaryGeneratedColumn('uuid')
  idZona: string;

  @Column('int', {
    nullable: false,
  })
  codigoZona: number;

  @Column('varchar', {
    nullable: false,
    length: 60,
  })
  nombreZona: string;

  //relaciones
  @OneToMany(() => Recinto, (recinto) => recinto.zona)
  recintos: Recinto[];
}
