import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { PAYERS } from '../../domain/repository/index';
import { Payers } from '../../domain/repository/payers';
import { CreatePayerHandler } from './create-payer.handler';
import { PayerId } from '../../domain/model/payer-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { CreatePayerCommand } from '../command/create-payer.command';
import { Payer } from '../../domain/model/payer';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';
import { ExpenseId } from '../../../expense/domain/model/expense-id';

describe('CreatePayerHandler', () => {
  let command$: CreatePayerHandler;

  const payers: Partial<Payers> = {};

  const payerId = PayerId.fromString(v4());
  const expenseId = ExpenseId.fromString(v4());
  const memberId = MemberId.fromString('Member name');
  const amount = ExpenseAmount.withMoneyAndCurrencyCode(
    ExpenseCurrencyUnit.fromBigInt(BigInt(100)),
    GroupCurrencyCode.fromString('EUR'),
  );
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePayerHandler,
        {
          provide: PAYERS,
          useValue: payers,
        },
      ],
    }).compile();

    command$ = module.get<CreatePayerHandler>(CreatePayerHandler);
    payers.save = jest.fn();
  });

  it('should creates a new payer', async () => {
    await command$.execute(
      new CreatePayerCommand(
        payerId.value,
        expenseId.value,
        memberId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    expect(payers.save).toHaveBeenCalledWith(
      Payer.add(payerId, expenseId, memberId, amount),
    );
  });
});
