import { ReceiptWasCreated } from './receipt-was-created';

export { ReceiptWasCreated };

export const receiptEventHandlers = {
    ReceiptWasCreated: (
    id: string,
    expenseId: string,
    date: Date,
    payers: string[],
    debtors: string[],
    money: bigint,
    currencyCode: string,
  ) => new ReceiptWasCreated(id, expenseId, date, payers, debtors, money, currencyCode),
};