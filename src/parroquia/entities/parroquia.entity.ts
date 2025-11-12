import { Canton } from 'src/canton/entities/canton.entity';
import { Circunscripcion } from 'src/circunscripcion/entities/circunscripcion.entity';
import { Recinto } from 'src/recinto/entities/recinto.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Parroquia {
  @PrimaryGeneratedColumn('uuid')
  idParroquia: string;

  @Column('int', {
    nullable: false,
    unique: true,
  })
  codigoParroquia: number;

  @Column('varchar', {
    nullable: false,
    length: 60,
  })
  nombreParroquia: string;

  @Column('varchar', {
    length: 5,
    nullable: true,
  })
  estadoParroquia: string | null;

  //relaciones
  @ManyToOne(() => Canton, (canton) => canton.parroquias, {
    nullable: false,
  })
  @JoinColumn({ name: 'idCanton' })
  canton: Canton;

  @OneToMany(() => Recinto, (recinto) => recinto.parroquia)
  recintos: Recinto[];

  // Relación opcional con Circunscripción
  @ManyToOne(
    () => Circunscripcion,
    (circunscripcion) => circunscripcion.parroquias,
    {
      nullable: true, // Relación opcional
      onDelete: 'SET NULL', // Si se elimina la circunscripción, los cantones quedan sin asignar
    },
  )
  @JoinColumn({ name: 'idCircunscripcion' })
  circunscripcion?: Circunscripcion | null;
}
