import { Recinto } from 'src/recinto/entities/recinto.entity';
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
export class Junta {
  @PrimaryGeneratedColumn('uuid')
  idJunta: string;

  @Column('int', {
    nullable: false,
    unique: false,
  })
  numJunta: number;

  @Column('varchar', {
    nullable: false,
    length: 10,
  })
  genero: string;

  //relaciones
  @ManyToOne(() => Recinto, (recinto) => recinto.juntas, {
    nullable: false,
  })
  @JoinColumn({ name: 'idRecinto' })
  recinto: Recinto;

  @OneToMany(() => Voto, (voto) => voto.junta)
  votos: Voto[];
}
