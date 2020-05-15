import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { CreateBillHandler } from './create-bill.handler';
import { Bills } from '../../../bill/domain/repository';
import {
  CheckUserInGroup,
  CHECK_USER_IN_GROUP,
} from '../../../member/domain/services/check-user-in-group.service';
import { BillId } from '../../domain/model/bill-id';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillName } from '../../domain/model/bill-name';
import { BillAmount } from '../../domain/model/bill-amount';
import { BillCurrencyUnit } from '../../domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillPayer } from '../../domain/model/bill-payer';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillDebtor } from '../../domain/model/bill-debtor';
import { BillDate } from '../../domain/model/bill-date';
import { BILLS } from '../../domain/repository/index';
import {
  TRANSACTIONS,
  Transactions,
} from '../../../transaction/domain/repository/index';
import { CreateBillCommand } from '../command/create-bill.command';
import { ParticipantDto } from '../../infrastructure/dto/bill.dto';
import { Bill } from '../../domain/model/bill';
import { CreatorIdNotFoundInGroup } from '../../domain/exception/creator-id-not-found-in-group.error';

describe('CreateBillHandler', () => {
  let command$: CreateBillHandler;

  const bills: Partial<Bills> = {};
  const transactions: Partial<Transactions> = {};
  const checkUserInGroup: Partial<CheckUserInGroup> = {};

  const billId = BillId.fromString(uuid());
  const groupId = GroupId.fromString(uuid());
  const name = BillName.fromString('Bill Name');
  const amount = BillAmount.withMoneyAndCurrencyCode(
    BillCurrencyUnit.fromNumber(100),
    GroupCurrencyCode.fromString('EUR'),
  );

  const payers = [
    new ParticipantDto(uuid(), amount.money.value),
    new ParticipantDto(uuid(), amount.money.value),
  ];
  const debtors = [
    new ParticipantDto(uuid(), amount.money.value),
    new ParticipantDto(uuid(), amount.money.value),
  ];

  const date = BillDate.fromDate(new Date('2019-11-15T17:43:50'));
  const creatorId = MemberId.fromString(uuid());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBillHandler,
        {
          provide: BILLS,
          useValue: bills,
        },
        {
          provide: TRANSACTIONS,
          useValue: transactions,
        },
        {
          provide: CHECK_USER_IN_GROUP,
          useValue: checkUserInGroup,
        },
      ],
    }).compile();

    command$ = module.get<CreateBillHandler>(CreateBillHandler);
    bills.find = jest.fn().mockResolvedValue(null);
    bills.save = jest.fn();
    transactions.saveDepositTransaction = jest.fn();
    transactions.saveDebtTransaction = jest.fn();
    checkUserInGroup.with = jest.fn().mockResolvedValue(creatorId.value);
  });

  it('should creates a new bill', async () => {
    await command$.execute(
      new CreateBillCommand(
        billId.value,
        groupId.value,
        name.value,
        date.value,
        amount.money.value,
        amount.currencyCode.value,
        payers,
        debtors,
        creatorId.value,
      ),
    );

    const newPayers = [
      BillPayer.withMemberIdAndAmount(
        MemberId.fromString(payers[0]._id),
        amount.money,
      ),
      BillPayer.withMemberIdAndAmount(
        MemberId.fromString(payers[1]._id),
        amount.money,
      ),
    ];
    const newDebtors = [
      BillDebtor.withMemberIdAndAmount(
        MemberId.fromString(debtors[0]._id),
        amount.money,
      ),
      BillDebtor.withMemberIdAndAmount(
        MemberId.fromString(debtors[1]._id),
        amount.money,
      ),
    ];

    expect(bills.save).toHaveBeenCalledWith(
      Bill.add(billId, groupId, name, amount, date, newPayers, newDebtors, creatorId),
    );
  });

  it('should not creates a bill if creator is not in group', async () => {
    checkUserInGroup.with = jest.fn().mockResolvedValue(null);

    expect(
        command$.execute(
            new CreateBillCommand(
              billId.value,
              groupId.value,
              name.value,
              date.value,
              amount.money.value,
              amount.currencyCode.value,
              payers,
              debtors,
              creatorId.value,
            ),
          )
    ).rejects.toThrow(CreatorIdNotFoundInGroup);

    expect(bills.save).toHaveBeenCalledTimes(0);
  });
});
