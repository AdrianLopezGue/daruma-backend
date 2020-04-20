import { BillWasCreated } from './bill-was-created';
import { BillPayer } from '../model/bill-payer';
import { BillDebtor } from '../model/bill-debtor';
export const billEventHandlers = {
  BillWasCreated: (
    id: string,
    groupId: string,
    name: string,
    money: number,
    currencyCode: string,
    date: Date,
    payers: BillPayer[],
    debtors: BillDebtor[],
    creatorId: string
  ) =>
    new BillWasCreated(
      id,
      groupId,
      name,
      money,
      currencyCode,
      date,
      payers,
      debtors,
      creatorId
    ),
};
