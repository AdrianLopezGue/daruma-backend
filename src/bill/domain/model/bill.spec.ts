import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { Bill } from './bill';
import { BillId } from './bill-id';
import { BillName } from './bill-name';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillDate } from './bill-date';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillAmount } from './bill-amount';
import { BillCurrencyUnit } from './bill-currency-unit';
import { BillWasCreated } from '../event/bill-was-created';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillPayer } from './bill-payer';
import { BillDebtor } from './bill-debtor';

describe('Bill', () => {
  let bill: Bill;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const billId = BillId.fromString(v4());
  const groupId = GroupId.fromString(v4());
  const name = BillName.fromString('Bill Name');
  const amount = BillAmount.withMoneyAndCurrencyCode(
    BillCurrencyUnit.fromBigInt(BigInt(100)),
    GroupCurrencyCode.fromString('EUR'),
  );
  const payers = [
    BillPayer.withMemberIdAndAmount(
      MemberId.fromString('111111'),
      amount.money,
    ),
    BillPayer.withMemberIdAndAmount(
      MemberId.fromString('2222222'),
      amount.money,
    ),
  ];
  const debtors = [
    BillDebtor.withMemberIdAndAmount(
      MemberId.fromString('111111'),
      amount.money,
    ),
    BillDebtor.withMemberIdAndAmount(
      MemberId.fromString('2222222'),
      amount.money,
    ),
  ];

  const date = BillDate.fromDate(new Date('2019-11-15T17:43:50'));

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
      Bill.add(billId, groupId, name, amount, date, payers, debtors),
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
        debtors
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
    expect(
      bill.amount.currencyCode.equals(amount.currencyCode),
    ).toBeTruthy();
  });

  it('has an date', () => {
    expect(bill.date.equals(date)).toBeTruthy();
  });
});
