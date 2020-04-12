import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Expenses } from '../../domain/repository/expenses';
import { ExpenseId } from '../../domain/model/expense-id';
import { Expense } from '../../domain/model/expense';

@Injectable()
export class ExpenseEventStore implements Expenses {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(expenseId: ExpenseId): Promise<Expense> {
    return this.eventStore.read(Expense, expenseId.value);
  }

  async find(expenseId: ExpenseId): Promise<Expense> | null {
    return this.eventStore.read(Expense, expenseId.value);
  }

  save(expense: Expense): void {
    expense = this.publisher.mergeObjectContext(expense);
    expense.commit();
  }
}
