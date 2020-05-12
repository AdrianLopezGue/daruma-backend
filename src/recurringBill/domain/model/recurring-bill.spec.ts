import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { RecurringBill } from './recurring-bill';
import { RecurringBillId } from './recurring-bill-id';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillDate } from '../../../bill/domain/model/bill-date';
import { RecurringBillPeriod } from './recurring-bill-period';
import { RecurringBillWasCreated } from '../event/recurring-bill-was-created.event';
import { RecurringBillWasRemoved } from '../event/recurring-bill-was-removed.event';
import { GroupId } from '../../../group/domain/model/group-id';
import { RecurringBillPeriodWasChanged } from '../event/recurring-bill-period-was-changed.event';

describe('RecurringBill', () => {
  let recurringBill: RecurringBill;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const recurringBillId = RecurringBillId.fromString(v4());
  const billId = BillId.fromString(v4());
  const groupId = GroupId.fromString(v4());
  const date = BillDate.fromDate(new Date('2019-11-15T17:43:50'));
  const period = RecurringBillPeriod.daily();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventBus$.publish = jest.fn();
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
  });

  it('can be created', () => {
    recurringBill = eventPublisher$.mergeObjectContext(
      RecurringBill.add(recurringBillId, billId, groupId, date, period),
    );
    recurringBill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new RecurringBillWasCreated(
        recurringBillId.value,
        billId.value,
        groupId.value,
        date.value,
        period.value,
      ),
    );
  });

  it('has an id', () => {
    expect(recurringBill.id.equals(recurringBillId)).toBeTruthy();
  });

  it('has an billId', () => {
    expect(recurringBill.billId.equals(billId)).toBeTruthy();
  });

  it('has an groupId', () => {
    expect(recurringBill.groupId.equals(groupId)).toBeTruthy();
  });

  it('has a date', () => {
    expect(recurringBill.date.equals(date)).toBeTruthy();
  });

  it('has a period', () => {
    expect(recurringBill.period.equals(period)).toBeTruthy();
  });

  it('period can be changed', () => {
    const newPeriod = RecurringBillPeriod.fromNumber(7);
    recurringBill = eventPublisher$.mergeObjectContext(recurringBill);
    recurringBill.changePeriod(newPeriod);
    recurringBill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new RecurringBillPeriodWasChanged(
        recurringBillId.value,
        date.value,
        newPeriod.value,
      ),
    );

    expect(recurringBill.period.equals(newPeriod)).toBeTruthy();
  });

  it('can be removed', () => {
    recurringBill = eventPublisher$.mergeObjectContext(recurringBill);
    recurringBill.remove();
    recurringBill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new RecurringBillWasRemoved(recurringBillId.value),
    );

    expect(recurringBill.isRemoved).toBeTruthy();
  });
});
