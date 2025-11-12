import { Circunscripcion } from 'src/circunscripcion/entities/circunscripcion.entity';
import { Dignidad } from 'src/dignidad/entities/dignidad.entity';
import { Partido } from 'src/partido/entities/partido.entity';
import { Provincia } from 'src/provincia/entities/provincia.entity';
import { Voto } from 'src/voto/entities/voto.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Candidato {
  @PrimaryGeneratedColumn('uuid')
  idCandidato: string;

  @Column('varchar', {
    nullable: false,
    length: 70,
  })
  nombreCandidato: string;

  @Column('varchar', {
    nullable: true,
    length: 75,
  })
  posicion: string | null;

  @Column('varchar', {
    nullable: true,
    length: 500,
  })
  fotoCandidato: string | null;

  // relaciones
  @OneToMany(() => Voto, (voto) => voto.candidato)
  votos: Voto[];

  @ManyToOne(() => Partido, (partido) => partido.candidatos, {
    nullable: true,
  })
  @JoinColumn({ name: 'idPartido' })
  partido?: Partido | null;

  @ManyToOne(() => Dignidad, (dignidad) => dignidad.candidatos, {
    nullable: false,
  })
  @JoinColumn({ name: 'idDignidad' })
  dignidad: Dignidad;

  @ManyToOne(() => Provincia, (provincia) => provincia.candidatos, {
    nullable: true,
  })
  @JoinColumn({ name: 'idProvincia' })
  provincia?: Provincia | null;

  @ManyToOne(
    () => Circunscripcion,
    (circunscripcion) => circunscripcion.candidatos,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'idCircunscripcion' })
  circunscripcion?: Circunscripcion | null;
}
