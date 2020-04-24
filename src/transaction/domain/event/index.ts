import { DebtTransactionWasCreated } from './debt-transaction-was-created';
import { DepositTransactionWasCreated } from './deposit-transaction-was-created';
import { TransferTransactionWasCreated } from './transfer-transaction-was-created';

export const transactionEventHandlers = {
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
  ),
  TransferTransactionWasCreated: (
    id: string,
    idSender: string,
    idBeneficiary: string,
    money: number,
    currencyCode: string,
  ) =>
  new TransferTransactionWasCreated(
    id,
    idSender,
    idBeneficiary,
    money,
    currencyCode,
  )
};
