import { Voto } from 'src/voto/entities/voto.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Simulacion {
  @PrimaryGeneratedColumn('uuid')
  idSimulacion: string;

  @CreateDateColumn({ type: 'timestamptz' })
  fechaCreacion: Date;

  @Column('varchar', {
    nullable: false,
    length: 60,
  })
  nombreSimulacion: string;

  @Column('bool', {
    nullable: false,
    default: true,
  })
  estado: boolean;

  // relaciones
  @OneToMany(() => Voto, (voto) => voto.simulacion)
  votos: Voto[];
}
