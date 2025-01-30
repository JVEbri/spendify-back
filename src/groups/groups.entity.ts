import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Invitation } from '../invitations/invitations.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.ownedGroups, { eager: true }) // Relación con el owner
  owner: User;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @OneToMany(() => Invitation, (invitation) => invitation.group)
  invitations: Invitation[];
}
