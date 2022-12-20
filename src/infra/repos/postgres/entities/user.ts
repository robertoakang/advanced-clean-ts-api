import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'facebook_id', nullable: true })
    facebookId?: string

  @Column({ name: 'foto', nullable: true })
    pictureUrl?: string

  @Column({ name: 'iniciais', nullable: true })
    initials?: string
}
