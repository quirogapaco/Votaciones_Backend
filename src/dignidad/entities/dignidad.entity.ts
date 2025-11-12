import { Candidato } from 'src/candidato/entities/candidato.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dignidad {
  @PrimaryGeneratedColumn('uuid')
  idDignidad: string;

  @Column('varchar', {
    nullable: false,
    length: 50,
  })
  nombreDignidad: string;

  @Column('int', {
    nullable: false,
  })
  codigoDignidad: number;

  @Column('varchar', {
    nullable: true,
    length: 500,
  })
  fotoDignidad: string | null;

  // relaciones
  @OneToMany(() => Candidato, (candidato) => candidato.dignidad)
  candidatos: Candidato[];
}
