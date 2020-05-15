import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { TransactionId } from './transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { DepositTransaction } from './deposit-transaction';
import { DepositTransactionWasCreated } from '../event/deposit-transaction-was-created.event';
import { DepositTransactionWasRemoved } from '../event/deposit-transaction-was-removed.event';

describe('DepositTransaction', () => {
  let depositTransaction: DepositTransaction;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const transactionId = TransactionId.fromString(uuid());
  const memberId = MemberId.fromString(uuid());
  const billId = BillId.fromString(uuid());
  const amount = BillAmount.withMoneyAndCurrencyCode(
    BillCurrencyUnit.fromNumber(100),
    GroupCurrencyCode.fromString('EUR'),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventBus$.publish = jest.fn();
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
  });

  it('can be created', () => {
    depositTransaction = eventPublisher$.mergeObjectContext(
      DepositTransaction.add(transactionId, memberId, billId, amount),
    );
    depositTransaction.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new DepositTransactionWasCreated(
        transactionId.value,
        memberId.value,
        billId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );
  });

  it('has an id', () => {
    expect(depositTransaction.id.equals(transactionId)).toBeTruthy();
  });

  it('has a member id', () => {
    expect(depositTransaction.memberId.equals(memberId)).toBeTruthy();
  });

  it('has a bill id', () => {
    expect(depositTransaction.billId.equals(billId)).toBeTruthy();
  });

  it('has an amount', () => {
    expect(depositTransaction.amount.money.equals(amount.money)).toBeTruthy();
    expect(
      depositTransaction.amount.currencyCode.equals(amount.currencyCode),
    ).toBeTruthy();
  });

  it('can be removed', () => {
    depositTransaction = eventPublisher$.mergeObjectContext(depositTransaction);
    depositTransaction.remove();
    depositTransaction.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new DepositTransactionWasRemoved(
        transactionId.value,
        memberId.value,
        amount.money.value,
      ),
    );

    expect(depositTransaction.isRemoved).toBeTruthy();
  });
});
