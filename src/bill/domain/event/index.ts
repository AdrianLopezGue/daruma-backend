import { BillWasCreated } from './bill-was-created.event';
import { BillPayer } from '../model/bill-payer';
import { BillDebtor } from '../model/bill-debtor';
import { BillWasRemoved } from './bill-was-removed.event';
import { BillCurrencyCodeWasChanged } from './bill-currency-code-was-changed.event';
import { BillNameWasChanged } from './bill-name-was-changed.event';
import { BillDateWasChanged } from './bill-date-was-changed.event';
import { BillPayerWasRemoved } from './bill-payer-was-removed.event';
import { BillDebtorWasRemoved } from './bill-debtor-was-removed.event';
import { BillPayerWasAdded } from './bill-payer-was-added.event';
import { BillDebtorWasAdded } from './bill-debtor-was-added.event';
import { BillMoneyWasChanged } from './bill-money-was-changed.event';
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
    creatorId: string,
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
      creatorId,
    ),
  BillWasRemoved: (id: string) => new BillWasRemoved(id),
  BillCurrencyCodeWasChanged: (id: string, currencyCode: string) =>
    new BillCurrencyCodeWasChanged(id, currencyCode),
  BillMoneyWasChanged: (id: string, money: number) =>
    new BillMoneyWasChanged(id, money),
  BillNameWasChanged: (id: string, name: string) =>
    new BillNameWasChanged(id, name),
  BillDateWasChanged: (id: string, date: Date) =>
    new BillDateWasChanged(id, date),
  BillPayerWasRemoved: (id: string, payerId: string) =>
    new BillPayerWasRemoved(id, payerId),
  BillDebtorWasRemoved: (id: string, debtorId: string) =>
    new BillDebtorWasRemoved(id, debtorId),
  BillPayerWasAdded: (id: string, payer: BillPayer) =>
    new BillPayerWasAdded(id, payer),
  BillDebtorWasAdded: (id: string, debtor: BillDebtor) =>
    new BillDebtorWasAdded(id, debtor),
};
