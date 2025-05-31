// src/expenses/expenses.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expenses.entity';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { ExpensesRepository } from './expenses.repository';
import { QueryHelperModule } from '../common/query-helper.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), QueryHelperModule],
  providers: [ExpensesService, ExpensesRepository],
  controllers: [ExpensesController],
})
export class ExpensesModule {}
