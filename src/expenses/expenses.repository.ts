// src/expenses/expenses.repository.ts

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Expense } from './expenses.entity';
import { QueryHelperService } from '../common/query-helper.service';
import { QueryHelperDto } from '../common/QueryHelper.dto';

@Injectable()
export class ExpensesRepository extends Repository<Expense> {
  constructor(
    private dataSource: DataSource,
    private readonly queryHelper: QueryHelperService, // ✅ inyectado
  ) {
    super(Expense, dataSource.createEntityManager());
  }

  async findAllByGroup(groupId: string, query: QueryHelperDto): Promise<Expense[]> {
    const qb = this.createQueryBuilder('expense').leftJoinAndSelect('expense.user', 'user').where('expense.group_id = :groupId', { groupId });

    // Aplica filtros dinámicos
    this.queryHelper.apply(qb, query, 'expense', ['expense.date', 'expense.category', 'user.name']);

    return qb.getMany();
  }

  async addMetaColumn(groupId: string, month: number, year: number, key: string) {
    await this.createQueryBuilder()
      .update()
      .set({
        meta: () => `meta || jsonb_build_object('${key}', '')`,
      })
      .where(`group_id = :groupId`, { groupId })
      .andWhere(`EXTRACT(MONTH FROM date) = :month`, { month })
      .andWhere(`EXTRACT(YEAR FROM date) = :year`, { year })
      .execute();
    return { message: `Columna '${key}' añadida al meta de los gastos del mes` };
  }

  async removeMetaColumn(groupId: string, month: number, year: number, key: string) {
    await this.createQueryBuilder()
      .update()
      .set({
        meta: () => `meta - '${key}'`,
      })
      .where(`group_id = :groupId`, { groupId })
      .andWhere(`EXTRACT(MONTH FROM date) = :month`, { month })
      .andWhere(`EXTRACT(YEAR FROM date) = :year`, { year })
      .execute();
    return { message: `Columna '${key}' eliminada del meta de los gastos del mes` };
  }

  async renameMetaColumn(groupId: string, month: number, year: number, oldKey: string, newKey: string): Promise<void> {
    await this.createQueryBuilder()
      .update(Expense)
      .set({
        meta: () => `jsonb_set(meta - '${oldKey}', '{${newKey}}', to_jsonb(meta->'${oldKey}'))`,
      })
      .where('group_id = :groupId', { groupId })
      .andWhere('EXTRACT(MONTH FROM date) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM date) = :year', { year })
      .execute();
  }
}
