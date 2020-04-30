import { DebtTransactionWasCreated } from './debt-transaction-was-created.event';
import { DepositTransactionWasCreated } from './deposit-transaction-was-created.event';
import { TransferTransactionWasCreated } from './transfer-transaction-was-created.event';
import { DebtTransactionWasRemoved } from './debt-transaction-was-removed.event';
import { DepositTransactionWasRemoved } from './deposit-transaction-was-removed.event';
import { TransferTransactionWasRemoved } from './transfer-transaction-was-removed.event';

export const transactionEventHandlers = {
  DebtTransactionWasCreated: (
    id: string,
    idMember: string,
    idBill: string,
    money: number,
    currencyCode: string,
  ) => new DebtTransactionWasCreated(id, idMember, idBill, money, currencyCode),
  DepositTransactionWasCreated: (
    id: string,
    idMember: string,
    idBill: string,
    money: number,
    currencyCode: string,
  ) =>
    new DepositTransactionWasCreated(id, idMember, idBill, money, currencyCode),
  TransferTransactionWasCreated: (
    id: string,
    idSender: string,
    idBeneficiary: string,
    money: number,
    currencyCode: string,
    idGroup: string,
  ) =>
    new TransferTransactionWasCreated(
      id,
      idSender,
      idBeneficiary,
      money,
      currencyCode,
      idGroup,
    ),
  DebtTransactionWasRemoved: (id: string) => new DebtTransactionWasRemoved(id),
  DepositTransactionWasRemoved: (id: string) => new DepositTransactionWasRemoved(id),
  TransferTransactionWasRemoved: (id: string) => new TransferTransactionWasRemoved(id),
};
