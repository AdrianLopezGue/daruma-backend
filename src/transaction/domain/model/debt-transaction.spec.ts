import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { DebtTransaction } from './debt-transaction';
import { TransactionId } from './transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { DebtTransactionWasCreated } from '../event/debt-transaction-was-created.event';
import { DebtTransactionWasRemoved } from '../event/debt-transaction-was-removed.event';

describe('DebtTransaction', () => {
  let debtTransaction: DebtTransaction;
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
    debtTransaction = eventPublisher$.mergeObjectContext(
      DebtTransaction.add(transactionId, memberId, billId, amount),
    );
    debtTransaction.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new DebtTransactionWasCreated(
        transactionId.value,
        memberId.value,
        billId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );
  });

  it('has an id', () => {
    expect(debtTransaction.id.equals(transactionId)).toBeTruthy();
  });

  it('has a member id', () => {
    expect(debtTransaction.memberId.equals(memberId)).toBeTruthy();
  });

  it('has a bill id', () => {
    expect(debtTransaction.billId.equals(billId)).toBeTruthy();
  });

  it('has an amount', () => {
    expect(debtTransaction.amount.money.equals(amount.money)).toBeTruthy();
    expect(
      debtTransaction.amount.currencyCode.equals(amount.currencyCode),
    ).toBeTruthy();
  });

  it('can be removed', () => {
    debtTransaction = eventPublisher$.mergeObjectContext(debtTransaction);
    debtTransaction.remove();
    debtTransaction.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new DebtTransactionWasRemoved(
        transactionId.value,
        memberId.value,
        amount.money.value,
      ),
    );

    expect(debtTransaction.isRemoved).toBeTruthy();
  });
});
