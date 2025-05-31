import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Patch } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense } from './expenses.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { QueryHelperDto } from '../common/QueryHelper.dto';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('group/:groupId')
  findByGroup(@Param('groupId') groupId: string, @Query() query: QueryHelperDto) {
    return this.expensesService.findAllByGroup(groupId, query);
  }

  @Post()
  create(@Body() expense: Partial<Expense>) {
    return this.expensesService.create(expense);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }

  @Patch('group/:groupId/meta/add')
  addMetaColumn(@Param('groupId') groupId: string, @Query('month') month: number, @Query('year') year: number, @Body('key') key: string) {
    return this.expensesService.addMetaColumn(groupId, month, year, key);
  }

  @Patch('group/:groupId/meta/remove')
  removeMetaColumn(@Param('groupId') groupId: string, @Query('month') month: number, @Query('year') year: number, @Body('key') key: string) {
    return this.expensesService.removeMetaColumn(groupId, month, year, key);
  }

  @Patch('group/:groupId/meta/rename')
  renameMetaColumn(
    @Param('groupId') groupId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @Body('oldKey') oldKey: string,
    @Body('newKey') newKey: string,
  ) {
    return this.expensesService.renameMetaColumn(groupId, month, year, oldKey, newKey);
  }
}
