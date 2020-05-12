import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { ChangeRecurringBillPeriodHandler } from './change-recurring-bill-period.handler';
import { RECURRING_BILLS, RecurringBills } from '../../domain/repository/recurring-bills';
import { RecurringBillId } from '../../domain/model/recurring-bill-id';
import { RecurringBillPeriod } from '../../domain/model/recurring-bill-period';
import { BillId } from '../../../bill/domain/model/bill-id';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillDate } from '../../../bill/domain/model/bill-date';
import { RecurringBill } from '../../domain/model/recurring-bill';
import { ChangeRecurringBillPeriodCommand } from '../command/change-recurring-bill-period.command';
import { RecurringBillIdNotFoundError } from '../../domain/exception/recurring-bill-id-not-found.error';


describe('ChangeRecurringBillPeriodHandler', () => {
  let command$: ChangeRecurringBillPeriodHandler;

  const recurringBills: Partial<RecurringBills> = {};

  const recurringBillId = RecurringBillId.fromString(uuid());
  const billId = BillId.fromString(uuid());
  const groupId = GroupId.fromString(uuid());
  const date = BillDate.fromDate(new Date('2019-11-15T17:43:50'));
  const period = RecurringBillPeriod.daily();


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeRecurringBillPeriodHandler,
        {
          provide: RECURRING_BILLS,
          useValue: recurringBills,
        },
      ],
    }).compile();

    command$ = module.get<ChangeRecurringBillPeriodHandler>(ChangeRecurringBillPeriodHandler);
    recurringBills.find = jest.fn().mockResolvedValue(null);
    recurringBills.save = jest.fn();
  });

  it('should change recurring bill period', async () => {
    const recurringBill = RecurringBill.add(recurringBillId, billId, groupId, date, period);
    const newPeriod = RecurringBillPeriod.fromNumber(7);

    recurringBills.find = jest.fn().mockResolvedValue(recurringBill);
    recurringBill.changePeriod(newPeriod);

    await command$.execute(
      new ChangeRecurringBillPeriodCommand(recurringBillId.value, newPeriod.value),
    );

    expect(recurringBills.save).toHaveBeenCalledTimes(1);
    expect(recurringBills.save).toHaveBeenCalledWith(recurringBill);
  });

  it('should throw an error if recurring bill does not exists', async () => {
    expect(
      command$.execute(new ChangeRecurringBillPeriodCommand(recurringBillId.value, 7)),
    ).rejects.toThrow(RecurringBillIdNotFoundError);

    expect(recurringBills.save).toHaveBeenCalledTimes(0);
  });
});
