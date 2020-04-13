import { ExpenseWasCreated } from './expense-was-created';
export { ExpenseWasCreated };

export const expenseEventHandlers = {
  ExpenseWasCreated: (
    id: string,
    groupId: string,
    name: string,
    money: bigint,
    currencyCode: string,
    date: Date,
    periodicity: string,
    endPeriodicity: Date,
  ) =>
    new ExpenseWasCreated(
      id,
      groupId,
      name,
      money,
      currencyCode,
      date,
      periodicity,
      endPeriodicity,
    ),
};
