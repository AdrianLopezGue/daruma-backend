import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { BillId } from '../../../bill/domain/model/bill-id';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { MemberId } from '../../../member/domain/model/member-id';
import { Transactions } from '../../../transaction/domain/repository';
import { DebtTransaction } from '../../domain/model/debt-transaction';
import { TransactionId } from '../../domain/model/transaction-id';
import { TRANSACTIONS } from '../../domain/repository/index';
import { TransactionService } from '../../infrastructure/service/transaction.service';
import { RemoveDebtTransactionCommand } from '../command/remove-debt-transaction.command';
import { RemoveDebtTransactionHandler } from './remove-debt-transaction.handler';
import { TransactionIdNotFoundError } from '../../domain/exception/transaction-id-not-found.error';

describe('RemoveDebtTransactionHandler', () => {
  let command$: RemoveDebtTransactionHandler;

  const transactions: Partial<Transactions> = {};
  const transactionService: Partial<TransactionService> = {};

  const transactionId = TransactionId.fromString(uuid());
  const memberId = MemberId.fromString(uuid());
  const billId = BillId.fromString(uuid());
  const amount = BillAmount.withMoneyAndCurrencyCode(
    BillCurrencyUnit.fromNumber(100),
    GroupCurrencyCode.fromString('EUR'),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveDebtTransactionHandler,
        {
          provide: TRANSACTIONS,
          useValue: transactions,
        },
        {
            provide: TransactionService,
            useValue: transactionService,
        },
      ],
    }).compile();

    command$ = module.get<RemoveDebtTransactionHandler>(RemoveDebtTransactionHandler);
    transactions.findDebtTransaction = jest.fn().mockResolvedValue(null);
    transactions.saveDebtTransaction = jest.fn();
    transactionService.getDebtTransactionByBillIdAndMemberId = jest.fn().mockResolvedValue(null);
  });

  it('should remove a debt transaction', async () => {
    const debtTransaction = DebtTransaction.add(transactionId, memberId, billId, amount);
    transactionService.getDebtTransactionByBillIdAndMemberId = jest.fn().mockResolvedValue(debtTransaction);
    transactions.findDebtTransaction = jest.fn().mockResolvedValue(debtTransaction);

    await command$.execute(new RemoveDebtTransactionCommand(billId.value, memberId.value));

    expect(transactions.saveDebtTransaction).toHaveBeenCalledTimes(1);
    expect(transactions.saveDebtTransaction).toHaveBeenCalledWith(debtTransaction);
  });

  it('should throw an error if transaction does not exists', async () => {
    const debtTransaction = DebtTransaction.add(transactionId, memberId, billId, amount);
    transactionService.getDebtTransactionByBillIdAndMemberId = jest.fn().mockResolvedValue(debtTransaction);
    transactions.findDebtTransaction = jest.fn().mockResolvedValue(null);


    expect(
      command$.execute(new RemoveDebtTransactionCommand(billId.value, memberId.value)),
    ).rejects.toThrow(TransactionIdNotFoundError);

    expect(transactions.saveDebtTransaction).toHaveBeenCalledTimes(0);
  });
});