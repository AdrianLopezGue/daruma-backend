import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { BillId } from '../../../bill/domain/model/bill-id';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { MemberId } from '../../../member/domain/model/member-id';
import { Transactions } from '../../../transaction/domain/repository';
import { TransactionIdNotFoundError } from '../../domain/exception/transaction-id-not-found.error';
import { DepositTransaction } from '../../domain/model/deposit-transaction';
import { TransactionId } from '../../domain/model/transaction-id';
import { TRANSACTIONS } from '../../domain/repository/index';
import { TransactionService } from '../../infrastructure/service/transaction.service';
import { RemoveDepositTransactionCommand } from '../command/remove-deposit-transaction.command';
import { RemoveDepositTransactionHandler } from './remove-deposit-transaction.handler';

describe('RemoveDepositTransactionHandler', () => {
  let command$: RemoveDepositTransactionHandler;

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
        RemoveDepositTransactionHandler,
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

    command$ = module.get<RemoveDepositTransactionHandler>(
      RemoveDepositTransactionHandler,
    );
    transactions.findDepositTransaction = jest.fn().mockResolvedValue(null);
    transactions.saveDepositTransaction = jest.fn();
    transactionService.getDepositTransactionByBillIdAndMemberId = jest
      .fn()
      .mockResolvedValue(null);
  });

  it('should remove a deposit transaction', async () => {
    const depositTransaction = DepositTransaction.add(
      transactionId,
      memberId,
      billId,
      amount,
    );
    transactionService.getDepositTransactionByBillIdAndMemberId = jest
      .fn()
      .mockResolvedValue(depositTransaction);
    transactions.findDepositTransaction = jest
      .fn()
      .mockResolvedValue(depositTransaction);

    await command$.execute(
      new RemoveDepositTransactionCommand(billId.value, memberId.value),
    );

    expect(transactions.saveDepositTransaction).toHaveBeenCalledTimes(1);
    expect(transactions.saveDepositTransaction).toHaveBeenCalledWith(
      depositTransaction,
    );
  });

  it('should throw an error if transaction does not exists', async () => {
    const depositTransaction = DepositTransaction.add(
      transactionId,
      memberId,
      billId,
      amount,
    );
    transactionService.getDepositTransactionByBillIdAndMemberId = jest
      .fn()
      .mockResolvedValue(depositTransaction);
    transactions.findDepositTransaction = jest.fn().mockResolvedValue(null);

    expect(
      command$.execute(
        new RemoveDepositTransactionCommand(billId.value, memberId.value),
      ),
    ).rejects.toThrow(TransactionIdNotFoundError);

    expect(transactions.saveDepositTransaction).toHaveBeenCalledTimes(0);
  });
});
