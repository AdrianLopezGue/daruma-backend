import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { RemoveRecurringBillHandler } from './remove-recurring-bill.handler';
import { RecurringBills, RECURRING_BILLS } from '../../domain/repository/recurring-bills';
import { RecurringBillId } from '../../domain/model/recurring-bill-id';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillDate } from '../../../bill/domain/model/bill-date';
import { RecurringBillPeriod } from '../../domain/model/recurring-bill-period';
import { RecurringBill } from '../../domain/model/recurring-bill';
import { RemoveRecurringBillCommand } from '../command/remove-recurring-bill.command';
import { RecurringBillIdNotFoundError } from '../../domain/exception/recurring-bill-id-not-found.error';
import { GroupId } from '../../../group/domain/model/group-id';

describe('RemoveRecurringBillHandler', () => {
  let command$: RemoveRecurringBillHandler;

  const recurringBills: Partial<RecurringBills> = {};

  const recurringBillId = RecurringBillId.fromString(uuid());
  const billId = BillId.fromString(uuid());
  const groupId = GroupId.fromString(uuid());
  const date = BillDate.fromDate(new Date('2019-11-15T17:43:50'));
  const period = RecurringBillPeriod.daily();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveRecurringBillHandler,
        {
          provide: RECURRING_BILLS,
          useValue: recurringBills,
        },
      ],
    }).compile();

    command$ = module.get<RemoveRecurringBillHandler>(RemoveRecurringBillHandler);
    recurringBills.find = jest.fn().mockResolvedValue(null);
    recurringBills.save = jest.fn();
  });

  it('should remove a recurring bill', async () => {
    const recurringBill = RecurringBill.add(recurringBillId, billId, groupId, date, period);
    recurringBills.find = jest.fn().mockResolvedValue(recurringBill);

    await command$.execute(new RemoveRecurringBillCommand(recurringBillId.value));

    expect(recurringBills.save).toHaveBeenCalledTimes(1);
    expect(recurringBills.save).toHaveBeenCalledWith(recurringBill);
  });

  it('should throw an error if member does not exists', async () => {
    recurringBills.find = jest.fn().mockResolvedValue(null);

    expect(
      command$.execute(new RemoveRecurringBillCommand(recurringBillId.value)),
    ).rejects.toThrow(RecurringBillIdNotFoundError);

    expect(recurringBills.save).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if member was removed', async () => {
    const recurringBill = RecurringBill.add(recurringBillId, billId, groupId, date, period);
    recurringBill.remove();
    recurringBills.find = jest.fn().mockResolvedValue(recurringBill);

    expect(
      command$.execute(new RemoveRecurringBillCommand(recurringBillId.value)),
    ).rejects.toThrow(RecurringBillIdNotFoundError);

    expect(recurringBills.save).toHaveBeenCalledTimes(0);
  });
});
