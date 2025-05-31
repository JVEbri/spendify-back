import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Group } from '../groups/groups.entity';

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  // añade las que quieras
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.EUR })
  currency: Currency;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, any>;

  @ManyToOne(() => User, (user) => user.expenses, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.expenses, { eager: false })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @CreateDateColumn()
  created_at: Date;
}
