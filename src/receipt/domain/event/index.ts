import { ReceiptWasCreated } from './receipt-was-created';
import { Payer } from '../../../payer/domain/model/payer';
import { Debtor } from '../../../debtor/domain/model/debtor';

export { ReceiptWasCreated };

export const receiptEventHandlers = {
    ReceiptWasCreated: (
    id: string,
    expenseId: string,
    date: Date,
    payers: Payer[],
    debtors: Debtor[],
    money: bigint,
    currencyCode: string,
  ) => new ReceiptWasCreated(id, expenseId, date, payers, debtors, money, currencyCode),
};