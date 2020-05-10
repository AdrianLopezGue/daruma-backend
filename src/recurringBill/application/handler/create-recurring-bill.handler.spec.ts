import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { CreateRecurringBillCommand } from '../command/create-recurring-bill.command';
import { RecurringBills, RECURRING_BILLS } from '../../domain/repository/recurring-bills';
import { RecurringBillId } from '../../domain/model/recurring-bill-id';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillDate } from '../../../bill/domain/model/bill-date';
import { RecurringBillPeriod } from '../../domain/model/recurring-bill-period';
import { CreateRecurringBillHandler } from './create-recurring-bill.handler';
import { RecurringBill } from '../../domain/model/recurring-bill';
import { GroupId } from '../../../group/domain/model/group-id';


describe('CreateRecurringBillCommand', () => {
  let command$: CreateRecurringBillHandler;

  const recurringBills: Partial<RecurringBills> = {};

  const recurringBillId = RecurringBillId.fromString(uuid());
  const billId = BillId.fromString(uuid());
  const groupId = GroupId.fromString(uuid());
  const date = BillDate.fromDate(new Date('2019-11-15T17:43:50'));
  const period = RecurringBillPeriod.daily();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRecurringBillHandler,
        {
          provide: RECURRING_BILLS,
          useValue: recurringBills,
        },
      ],
    }).compile();

    command$ = module.get<CreateRecurringBillHandler>(CreateRecurringBillHandler);
    recurringBills.find = jest.fn().mockResolvedValue(null);
    recurringBills.save = jest.fn();
  });

  it('should creates a new user', async () => {
    await command$.execute(
      new CreateRecurringBillCommand(
        recurringBillId.value,
        billId.value,
        groupId.value,
        date.value,
        period.value,
      ),
    );

    expect(recurringBills.save).toHaveBeenCalledWith(
      RecurringBill.add(recurringBillId, billId, groupId, date, period),
    );
  });
});
