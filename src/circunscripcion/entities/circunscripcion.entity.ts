import { Candidato } from 'src/candidato/entities/candidato.entity';
import { Parroquia } from 'src/parroquia/entities/parroquia.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Circunscripcion {
  @PrimaryGeneratedColumn('uuid')
  idCircunscripcion: string;

  @Column('int', { nullable: false })
  codigoCircunscripcion: number;

  @Column('varchar', { length: 60, nullable: false })
  nombreCircunscripcion: string;

  // Relación con Cantones
  @OneToMany(() => Parroquia, (parroquia) => parroquia.circunscripcion)
  parroquias: Parroquia[];

  // Relación con Candidatos
  @OneToMany(() => Candidato, (candidato) => candidato.circunscripcion) 
  candidatos: Candidato[];
}
