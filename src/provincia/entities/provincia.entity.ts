import { Candidato } from 'src/candidato/entities/candidato.entity';
import { Canton } from 'src/canton/entities/canton.entity';
import { Dignidad } from 'src/dignidad/entities/dignidad.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Provincia {
  @PrimaryGeneratedColumn('uuid')
  idProvincia: string;

  @Column('int', {
    nullable: false,
    unique: true,
  })
  codigoProvincia: number;

  @Column('varchar', {
    nullable: false,
    length: 60,
  })
  nombreProvincia: string;

  @Column('int', {
    nullable: true,
  })
  numElectores: number | null;

  @Column('int', {
    nullable: true,
  })
  numMujeres: number | null;

  @Column('int', {
    nullable: true,
  })
  numHombres: number | null;

  @Column('int', {
    nullable: true,
  })
  numJunta: number | null;

  @Column('int', {
    nullable: true,
  })
  numJuntasMujeres: number | null;

  @Column('int', {
    nullable: true,
  })
  numJuntasHombres: number | null;

  //relaciones
  @OneToMany(() => Canton, (canton) => canton.provincia)
  cantones: Canton[];

  @OneToMany(() => Candidato, (candidato) => candidato.provincia)
  candidatos: Candidato[];
}
