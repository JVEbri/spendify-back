import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { User } from '../users/users.entity';
import { Invitation } from '../invitations/invitations.entity';
import { Expense } from '../expenses/expenses.entity';
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
  @JoinTable({
    name: 'group_users', // Nombre de la tabla intermedia
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];

  @OneToMany(() => Invitation, (invitation) => invitation.group)
  invitations: Invitation[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];
}
