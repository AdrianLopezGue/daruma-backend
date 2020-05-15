import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { Transactions } from '../../../../dist/transaction/domain/repository/transactions';
import { TransactionId } from '../../domain/model/transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { TRANSACTIONS } from '../../domain/repository/index';
import { CreateDepositTransactionCommand } from '../command/create-deposit-transaction.command';
import { DepositTransaction } from '../../domain/model/deposit-transaction';
import { CreateDepositTransactionHandler } from './create-deposit-transaction.handler';


describe('CreateDepositTransactionHandler', () => {
  let command$: CreateDepositTransactionHandler;

  const transactions: Partial<Transactions> = {};

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
        CreateDepositTransactionHandler,
        {
          provide: TRANSACTIONS,
          useValue: transactions,
        },
      ],
    }).compile();

    command$ = module.get<CreateDepositTransactionHandler>(CreateDepositTransactionHandler);
    transactions.findDepositTransaction = jest.fn().mockResolvedValue(null);
    transactions.saveDepositTransaction = jest.fn();
 });

  it('should creates a new deposit transaction', async () => {
    await command$.execute(
      new CreateDepositTransactionCommand(
        transactionId.value,
        memberId.value,
        billId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    expect(transactions.saveDepositTransaction).toHaveBeenCalledWith(
      DepositTransaction.add(transactionId, memberId, billId, amount),
    );
  });
});