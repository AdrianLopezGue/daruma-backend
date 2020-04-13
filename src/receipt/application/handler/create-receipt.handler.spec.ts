import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { RECEIPTS } from '../../domain/repository/index';
import { Receipts } from '../../domain/repository/receipts';
import { CreateReceiptHandler } from './create-receipt.handler';
import { ReceiptId } from '../../domain/model/receipt-id';
import { PayerId } from '../../../payer/domain/model/payer-id';
import { DebtorId } from '../../../debtor/domain/model/debtor-id';
import { Receipt } from '../../domain/model/receipt';
import { CreateReceiptCommand } from '../command/create-receipt.command';
import { ExpenseId } from '../../../expense/domain/model/expense-id';
import { ExpenseDate } from '../../../expense/domain/model/expense-date';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';

describe('CreateReceiptHandler', () => {
  let command$: CreateReceiptHandler;

  const receipts: Partial<Receipts> = {};

  const receiptId = ReceiptId.fromString(v4());
  const expenseId = ExpenseId.fromString(v4());
  const date = ExpenseDate.fromDate(new Date('2019-11-15T17:43:50'));
  const payers = [PayerId.fromString('111111'), PayerId.fromString('222222')];
  const debtors = [DebtorId.fromString('333333'), DebtorId.fromString('444444')];
  const amount = ExpenseAmount.withMoneyAndCurrencyCode(
    ExpenseCurrencyUnit.fromBigInt(BigInt(100)),
    GroupCurrencyCode.fromString('EUR'),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReceiptHandler,
        {
          provide: RECEIPTS,
          useValue: receipts,
        },
      ],
    }).compile();

    command$ = module.get<CreateReceiptHandler>(CreateReceiptHandler);
    receipts.save = jest.fn();
  });

  it('should creates a new expense', async () => {
    await command$.execute(
      new CreateReceiptCommand(
        receiptId.value,
        expenseId.value,
        date.value,
        payers.map(payer => payer.value),
        debtors.map(debtor => debtor.value),
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    expect(receipts.save).toHaveBeenCalledWith(
      Receipt.add(
        receiptId,
        expenseId,
        date,
        payers,
        debtors,
        amount
      ),
    );
  });
});
