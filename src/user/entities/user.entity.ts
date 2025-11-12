import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;

  @Column('varchar', {
    nullable: false,
    length: 60,
  })
  nombre: string;

  @Column('varchar', {
    nullable: false,
    length: 60,
  })
  apellido: string;

  @Column('varchar', {
    nullable: false,
    length: 300,
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: false,
    length: 60,
    default: 'user',
    enum: ['registrador', 'admin'],
  })
  rol: string;
}
