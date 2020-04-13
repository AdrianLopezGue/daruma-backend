import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Model } from 'mongoose';
import {
  EXPENSE_MODEL,
  ExpenseView,
} from '../read-model/schema/expense.schema';
import { CreateExpenseCommand } from '../../application/command/create-expense.command';
import { ParticipantDto } from '../dto/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(EXPENSE_MODEL) private readonly expenseModel: Model<ExpenseView>,
  ) {}

  // tslint:disable-next-line: max-line-length
  async createExpense(
    expenseId: string,
    groupId: string,
    name: string,
    money: bigint,
    currencyCode: string,
    payers: ParticipantDto[],
    debtors: ParticipantDto[],
    date: Date,
    periodicity: string,
    endPeriodicity?: Date,
  ) {
    // tslint:disable-next-line: max-line-length
    return this.commandBus.execute(
      new CreateExpenseCommand(
        expenseId,
        groupId,
        name,
        money,
        currencyCode,
        payers,
        debtors,
        date,
        periodicity,
        endPeriodicity,
      ),
    );
  }

  async getExpenses(groupId: string): Promise<ExpenseView[]> {
    return this.expenseModel.find({ groupId: groupId }).exec();
  }
}
