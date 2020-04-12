import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { DEBTORS } from '../../domain/repository/index';
import { Debtors } from '../../domain/repository/debtors';
import { CreateDebtorHandler } from './create-debtor.handler';
import { DebtorId } from '../../domain/model/debtor-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';
import { ExpenseId } from '../../../expense/domain/model/expense-id';
import { CreateDebtorCommand } from '../command/create-debtor.command';
import { Debtor } from '../../domain/model/debtor';

describe('CreateDebtorHandler', () => {
  let command$: CreateDebtorHandler;

  const debtors: Partial<Debtors> = {};

  const debtorId = DebtorId.fromString(v4());
  const expenseId = ExpenseId.fromString(v4());
  const memberId = MemberId.fromString('Member name');
  const amount = ExpenseAmount.withMoneyAndCurrencyCode(
    ExpenseCurrencyUnit.fromBigInt(BigInt(100)),
    GroupCurrencyCode.fromString('EUR'),
  );
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDebtorHandler,
        {
          provide: DEBTORS,
          useValue: debtors,
        },
      ],
    }).compile();

    command$ = module.get<CreateDebtorHandler>(CreateDebtorHandler);
    debtors.save = jest.fn();
  });

  it('should creates a new debtor', async () => {
    await command$.execute(
      new CreateDebtorCommand(
        debtorId.value,
        expenseId.value,
        memberId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    expect(debtors.save).toHaveBeenCalledWith(
      Debtor.add(debtorId, expenseId, memberId, amount),
    );
  });
});
