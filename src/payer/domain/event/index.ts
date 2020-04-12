import { PayerWasCreated } from './payer-was-created';

export { PayerWasCreated };

export const payerEventHandlers = {
  PayerWasCreated: (
    id: string,
    expenseId: string,
    memberId: string,
    money: bigint,
    currencyCode: string,
  ) => new PayerWasCreated(id, expenseId, memberId, money, currencyCode),
};
