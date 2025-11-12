import { Junta } from 'src/junta/entities/junta.entity';
import { Parroquia } from 'src/parroquia/entities/parroquia.entity';
import { Zona } from 'src/zona/entities/zona.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recinto {
  @PrimaryGeneratedColumn('uuid')
  idRecinto: string;

  @Column('int', {
    nullable: false,
    unique: true,
  })
  codigoRecinto: number;

  @Column('varchar', {
    nullable: false,
    length: 300,
  })
  nombreRecinto: string;

  @Column('varchar', {
    length: 250,
    nullable: true,
  })
  direccionRecinto: string | null;

  @Column('varchar', {
    length: 10,
    nullable: true,
  })
  telefonoRecinto?: string | null;

  @Column('float8', {
    nullable: true,
  })
  coorX: number | null;

  @Column('float8', {
    nullable: true,
  })
  coorY: number | null;

  @Column('float8', {
    nullable: true,
  })
  longitud: number | null;

  @Column('float8', {
    nullable: true,
  })
  latitud: number | null;

  //relaciones
  @ManyToOne(() => Parroquia, (parroquia) => parroquia.recintos, {
    nullable: false,
  })
  @JoinColumn({ name: 'idParroquia' })
  parroquia: Parroquia;

  @ManyToOne(() => Zona, (zona) => zona.recintos, {
    nullable: true,
  })
  @JoinColumn({ name: 'idZona' })
  zona?: Zona;

  @OneToMany(() => Junta, (junta) => junta.recinto)
  juntas: Junta[];
}
