import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { CreateDebtTransactionHandler } from './create-debt-transaction.handler';
import { Transactions } from '../../../../dist/transaction/domain/repository/transactions';
import { TransactionId } from '../../domain/model/transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { TRANSACTIONS } from '../../domain/repository/index';
import { DebtTransaction } from '../../domain/model/debt-transaction';
import { CreateDebtTransactionCommand } from '../command/create-debt-transaction.command';

describe('CreateDebtTransactionHandler', () => {
  let command$: CreateDebtTransactionHandler;

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
        CreateDebtTransactionHandler,
        {
          provide: TRANSACTIONS,
          useValue: transactions,
        },
      ],
    }).compile();

    command$ = module.get<CreateDebtTransactionHandler>(
      CreateDebtTransactionHandler,
    );
    transactions.findDebtTransaction = jest.fn().mockResolvedValue(null);
    transactions.saveDebtTransaction = jest.fn();
  });

  it('should creates a new debt transaction', async () => {
    await command$.execute(
      new CreateDebtTransactionCommand(
        transactionId.value,
        memberId.value,
        billId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    expect(transactions.saveDebtTransaction).toHaveBeenCalledWith(
      DebtTransaction.add(transactionId, memberId, billId, amount),
    );
  });
});
