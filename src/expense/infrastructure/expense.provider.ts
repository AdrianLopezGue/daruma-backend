import { EXPENSES } from '../domain/repository/index';
import { Connection } from 'mongoose';
import { EXPENSE_MODEL, ExpenseSchema } from './read-model/schema/expense.schema';
import { ExpenseEventStore } from './eventstore/expense.event-store';

export const ExpenseProviders = [
  {
    provide: EXPENSE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Expense', ExpenseSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: EXPENSES,
    useClass: ExpenseEventStore,
  }
];
