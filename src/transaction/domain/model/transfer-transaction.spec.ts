import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { TransactionId } from './transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { TransferTransaction } from './transfer-transaction';
import { GroupId } from '../../../group/domain/model/group-id';
import { TransferTransactionWasCreated } from '../event/transfer-transaction-was-created.event';
import { TransferTransactionWasRemoved } from '../event/transfer-transaction-was-removed.event';

describe('TransferTransaction', () => {
  let transferTransaction: TransferTransaction;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const transactionId = TransactionId.fromString(uuid());
  const senderId = MemberId.fromString(uuid());
  const beneficiaryId = MemberId.fromString(uuid());
  const amount = BillAmount.withMoneyAndCurrencyCode(
    BillCurrencyUnit.fromNumber(100),
    GroupCurrencyCode.fromString('EUR'),
  );
  const groupId = GroupId.fromString(uuid());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventBus$.publish = jest.fn();
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
  });

  it('can be created', () => {
    transferTransaction = eventPublisher$.mergeObjectContext(
      TransferTransaction.add(
        transactionId,
        senderId,
        beneficiaryId,
        amount,
        groupId,
      ),
    );
    transferTransaction.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new TransferTransactionWasCreated(
        transactionId.value,
        senderId.value,
        beneficiaryId.value,
        amount.money.value,
        amount.currencyCode.value,
        groupId.value,
      ),
    );
  });

  it('has an id', () => {
    expect(transferTransaction.id.equals(transactionId)).toBeTruthy();
  });

  it('has a sender id', () => {
    expect(transferTransaction.senderId.equals(senderId)).toBeTruthy();
  });

  it('has a beneficiary id', () => {
    expect(
      transferTransaction.beneficiaryId.equals(beneficiaryId),
    ).toBeTruthy();
  });

  it('has an amount', () => {
    expect(transferTransaction.amount.money.equals(amount.money)).toBeTruthy();
    expect(
      transferTransaction.amount.currencyCode.equals(amount.currencyCode),
    ).toBeTruthy();
  });

  it('has a group id', () => {
    expect(transferTransaction.groupId.equals(groupId)).toBeTruthy();
  });

  it('can be removed', () => {
    transferTransaction = eventPublisher$.mergeObjectContext(
      transferTransaction,
    );
    transferTransaction.remove();
    transferTransaction.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new TransferTransactionWasRemoved(
        transactionId.value,
        senderId.value,
        beneficiaryId.value,
        amount.money.value,
      ),
    );

    expect(transferTransaction.isRemoved).toBeTruthy();
  });
});
