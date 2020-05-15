import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { Transactions } from '../../../../dist/transaction/domain/repository/transactions';
import { TransactionId } from '../../domain/model/transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { TRANSACTIONS } from '../../domain/repository/index';
import { CreateTransferTransactionHandler } from './create-transfer-transaction.handler';
import { GroupId } from '../../../group/domain/model/group-id';
import { TransferTransaction } from '../../domain/model/transfer-transaction';
import { CreateTransferTransactionCommand } from '../command/create-transfer-transaction.command';
import { Groups } from '../../../group/domain/repository/groups';
import { GROUPS } from '../../../group/domain/repository/index';
import {
  GET_MEMBERS_BY_GROUP_ID,
  GetMembersIdByGroupId,
} from '../../../member/domain/services/get-members-by-group-id.service';
import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { MemberIdNotFoundError } from '../../../member/domain/exception/member-id-not-found.error';

describe('CreateTransferTransactionHandler', () => {
  let command$: CreateTransferTransactionHandler;

  const transactions: Partial<Transactions> = {};
  const groups: Partial<Groups> = {};
  const getMembersByGroupId: Partial<GetMembersIdByGroupId> = {};

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
      providers: [
        CreateTransferTransactionHandler,
        {
          provide: TRANSACTIONS,
          useValue: transactions,
        },
        {
          provide: GROUPS,
          useValue: groups,
        },
        {
          provide: GET_MEMBERS_BY_GROUP_ID,
          useValue: getMembersByGroupId,
        },
      ],
    }).compile();

    command$ = module.get<CreateTransferTransactionHandler>(
      CreateTransferTransactionHandler,
    );
    transactions.findTransferTransaction = jest.fn().mockResolvedValue(null);
    transactions.saveTransferTransaction = jest.fn();
    groups.find = jest.fn().mockResolvedValue(null);
    getMembersByGroupId.with = jest.fn().mockResolvedValue(null);
  });

  it('should creates a new transfer transaction', async () => {
    groups.find = jest.fn().mockResolvedValue(groupId);
    getMembersByGroupId.with = jest
      .fn()
      .mockResolvedValue([senderId.value, beneficiaryId.value]);

    await command$.execute(
      new CreateTransferTransactionCommand(
        transactionId.value,
        senderId.value,
        beneficiaryId.value,
        amount.money.value,
        amount.currencyCode.value,
        groupId.value,
      ),
    );

    expect(transactions.saveTransferTransaction).toHaveBeenCalledWith(
      TransferTransaction.add(
        transactionId,
        senderId,
        beneficiaryId,
        amount,
        groupId,
      ),
    );
  });

  it('should not creates a new transfer function if group does not exist', async () => {
    expect(
      command$.execute(
        new CreateTransferTransactionCommand(
          transactionId.value,
          senderId.value,
          beneficiaryId.value,
          amount.money.value,
          amount.currencyCode.value,
          groupId.value,
        ),
      ),
    ).rejects.toThrow(GroupIdNotFoundError);

    expect(transactions.saveTransferTransaction).toHaveBeenCalledTimes(0);
  });

  it('should not creates a new transfer function if sender does not belong to group', async () => {
    groups.find = jest.fn().mockResolvedValue(groupId);
    getMembersByGroupId.with = jest
      .fn()
      .mockResolvedValue([senderId.value, beneficiaryId.value]);

    expect(
      command$.execute(
        new CreateTransferTransactionCommand(
          transactionId.value,
          uuid(),
          beneficiaryId.value,
          amount.money.value,
          amount.currencyCode.value,
          groupId.value,
        ),
      ),
    ).rejects.toThrow(MemberIdNotFoundError);

    expect(transactions.saveTransferTransaction).toHaveBeenCalledTimes(0);
  });

  it('should not creates a new transfer function if beneficiary does not belong to group', async () => {
    groups.find = jest.fn().mockResolvedValue(groupId);
    getMembersByGroupId.with = jest
      .fn()
      .mockResolvedValue([senderId.value, beneficiaryId.value]);

    expect(
      command$.execute(
        new CreateTransferTransactionCommand(
          transactionId.value,
          senderId.value,
          uuid(),
          amount.money.value,
          amount.currencyCode.value,
          groupId.value,
        ),
      ),
    ).rejects.toThrow(MemberIdNotFoundError);

    expect(transactions.saveTransferTransaction).toHaveBeenCalledTimes(0);
  });
});
