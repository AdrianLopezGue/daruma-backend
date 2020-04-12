import { DebtorWasCreated } from './debtor-was-created';


export { DebtorWasCreated };

export const debtorEventHandlers = {
  DebtorWasCreated: (
    id: string,
    expenseId: string,
    memberId: string,
    money: bigint,
    currencyCode: string,
  ) => new DebtorWasCreated(id, expenseId, memberId, money, currencyCode),
};
