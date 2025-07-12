// src/expenses/expenses.service.ts

import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { Expense } from './expenses.entity';
import { QueryHelperDto } from '../common/QueryHelper.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly expensesRepo: ExpensesRepository) {}

  findAllByGroup(groupId: string, query: QueryHelperDto) {
    return this.expensesRepo.findAllByGroup(groupId, query);
  }

  create(expense: Partial<Expense>) {
    return this.expensesRepo.save(expense);
  }

  remove(id: string) {
    return this.expensesRepo.delete(id);
  }

  async updateExpense(id: string, data: Partial<Expense>) {
    return this.expensesRepo.updateExpense(id, data);
  }

  async addMetaColumn(groupId: string, month: number, year: number, key: string) {
    return this.expensesRepo.addMetaColumn(groupId, month, year, key);
  }

  async removeMetaColumn(groupId: string, month: number, year: number, key: string) {
    return this.expensesRepo.removeMetaColumn(groupId, month, year, key);
  }

  async renameMetaColumn(groupId: string, month: number, year: number, oldKey: string, newKey: string) {
    return this.expensesRepo.renameMetaColumn(groupId, month, year, oldKey, newKey);
  }
}
