import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { Bill } from './bill';
import { BillId } from './bill-id';
import { BillName } from './bill-name';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillDate } from './bill-date';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillAmount } from './bill-amount';
import { BillCurrencyUnit } from './bill-currency-unit';
import { BillWasCreated } from '../event/bill-was-created.event';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillPayer } from './bill-payer';
import { BillDebtor } from './bill-debtor';
import { BillWasRemoved } from '../event/bill-was-removed.event';
import { BillNameWasChanged } from '../event/bill-name-was-changed.event';
import { BillPayerWasAdded } from '../event/bill-payer-was-added.event';
import { BillDebtorWasAdded } from '../event/bill-debtor-was-added.event';
import { BillMoneyWasChanged } from '../event/bill-money-was-changed.event';
import { BillCurrencyCodeWasChanged } from '../event/bill-currency-code-was-changed.event';
import { BillDateWasChanged } from '../event/bill-date-was-changed.event';

describe('Bill', () => {
  let bill: Bill;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const billId = BillId.fromString(uuid());
  const groupId = GroupId.fromString(uuid());
  const name = BillName.fromString('Bill Name');
  const amount = BillAmount.withMoneyAndCurrencyCode(
    BillCurrencyUnit.fromNumber(100),
    GroupCurrencyCode.fromString('EUR'),
  );
  const payers = [
    BillPayer.withMemberIdAndAmount(MemberId.fromString(uuid()), amount.money),
    BillPayer.withMemberIdAndAmount(MemberId.fromString(uuid()), amount.money),
  ];
  const debtors = [
    BillDebtor.withMemberIdAndAmount(MemberId.fromString(uuid()), amount.money),
    BillDebtor.withMemberIdAndAmount(MemberId.fromString(uuid()), amount.money),
  ];

  const date = BillDate.fromDate(new Date('2019-11-15T17:43:50'));
  const creatorId = MemberId.fromString(uuid());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventBus$.publish = jest.fn();
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
  });

  it('can be created', () => {
    bill = eventPublisher$.mergeObjectContext(
      Bill.add(billId, groupId, name, amount, date, payers, debtors, creatorId),
    );
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillWasCreated(
        billId.value,
        groupId.value,
        name.value,
        amount.money.value,
        amount.currencyCode.value,
        date.value,
        payers,
        debtors,
        creatorId.value,
      ),
    );
  });

  it('has an id', () => {
    expect(bill.id.equals(billId)).toBeTruthy();
  });

  it('has an groupId', () => {
    expect(bill.groupId.equals(groupId)).toBeTruthy();
  });

  it('has a name', () => {
    expect(bill.name.equals(name)).toBeTruthy();
  });

  it('has an amount', () => {
    expect(bill.amount.money.equals(amount.money)).toBeTruthy();
    expect(bill.amount.currencyCode.equals(amount.currencyCode)).toBeTruthy();
  });

  it('has an date', () => {
    expect(bill.date.equals(date)).toBeTruthy();
  });

  it('can be renamed', () => {
    const newName = BillName.fromString('New bill name');
    bill = eventPublisher$.mergeObjectContext(bill);
    bill.rename(newName);
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillNameWasChanged(billId.value, newName.value),
    );

    expect(bill.name.equals(newName)).toBeTruthy();
  });

  it('can add new payer', () => {
    const newPayer = BillPayer.withMemberIdAndAmount(
      MemberId.fromString(uuid()),
      amount.money,
    );

    bill = eventPublisher$.mergeObjectContext(bill);
    bill.addPayer(newPayer);
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillPayerWasAdded(billId.value, newPayer),
    );

    expect(bill.payers).toContain(newPayer);
  });

  it('can remove payer', () => {
    const newPayer = BillPayer.withMemberIdAndAmount(
      MemberId.fromString(uuid()),
      amount.money,
    );

    bill = eventPublisher$.mergeObjectContext(bill);
    bill.addPayer(newPayer);
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillPayerWasAdded(billId.value, newPayer),
    );

    expect(bill.payers).toContain(newPayer);

    bill.removePayer(newPayer.memberId);
    bill.commit();

    expect(bill.payers).not.toContain(newPayer);
  });

  it('can add new debtor', () => {
    const newDebtor = BillDebtor.withMemberIdAndAmount(
      MemberId.fromString(uuid()),
      amount.money,
    );

    bill = eventPublisher$.mergeObjectContext(bill);
    bill.addDebtor(newDebtor);
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillDebtorWasAdded(billId.value, newDebtor),
    );

    expect(bill.debtors).toContain(newDebtor);
  });

  it('can remove debtor', () => {
    const newDebtor = BillDebtor.withMemberIdAndAmount(
      MemberId.fromString(uuid()),
      amount.money,
    );

    bill = eventPublisher$.mergeObjectContext(bill);
    bill.addDebtor(newDebtor);
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillDebtorWasAdded(billId.value, newDebtor),
    );

    expect(bill.debtors).toContain(newDebtor);

    bill.removeDebtor(newDebtor.memberId);
    bill.commit();

    expect(bill.debtors).not.toContain(newDebtor);
  });

  it('can change money', () => {
    const newMoney = BillCurrencyUnit.fromNumber(200);
    bill = eventPublisher$.mergeObjectContext(bill);
    bill.changeMoney(newMoney);
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillMoneyWasChanged(billId.value, newMoney.value),
    );

    expect(bill.amount.money.equals(newMoney)).toBeTruthy();
  });

  it('can change currency code', () => {
    const newCurrencyCode = GroupCurrencyCode.fromString('USD');
    bill = eventPublisher$.mergeObjectContext(bill);
    bill.changeCurrencyCode(newCurrencyCode);
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillCurrencyCodeWasChanged(billId.value, newCurrencyCode.value),
    );

    expect(bill.amount.currencyCode.equals(newCurrencyCode)).toBeTruthy();
  });

  it('can change date', () => {
    const newDate = BillDate.fromDate(new Date('2019-11-16T17:43:50'));
    bill = eventPublisher$.mergeObjectContext(bill);
    bill.changeDate(newDate);
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillDateWasChanged(billId.value, newDate.value),
    );

    expect(bill.date.equals(newDate)).toBeTruthy();
  });

  it('can be removed', () => {
    bill = eventPublisher$.mergeObjectContext(bill);
    bill.remove();
    bill.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new BillWasRemoved(billId.value),
    );

    expect(bill.isRemoved).toBeTruthy();
  });
});
