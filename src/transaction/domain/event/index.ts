import { DebtTransactionWasCreated } from './debt-transaction-was-created';
import { DepositTransactionWasCreated } from './deposit-transaction-was-created';

export const billEventHandlers = {
  DebtTransactionWasCreated: (
    id: string,
    idMember: string,
    idBill: string,
    money: number,
    currencyCode: string,
  ) =>
    new DebtTransactionWasCreated(
      id,
      idMember,
      idBill,
      money,
      currencyCode,
    ),
  DepositTransactionWasCreated: (
    id: string,
    idMember: string,
    idBill: string,
    money: number,
    currencyCode: string,
  ) =>
  new DepositTransactionWasCreated(
    id,
    idMember,
    idBill,
    money,
    currencyCode,
  )
};
