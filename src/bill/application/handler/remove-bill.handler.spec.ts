import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { RemoveBillHandler } from './remove-bill.handler';
import { Bills } from '../../../bill/domain/repository/bills';
import { BillId } from '../../domain/model/bill-id';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillName } from '../../domain/model/bill-name';
import { BillAmount } from '../../domain/model/bill-amount';
import { BillCurrencyUnit } from '../../domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillDate } from '../../domain/model/bill-date';
import { MemberId } from '../../../member/domain/model/member-id';
import { BILLS } from '../../domain/repository/index';
import { Bill } from '../../domain/model/bill';
import { BillPayer } from '../../domain/model/bill-payer';
import { BillDebtor } from '../../domain/model/bill-debtor';
import { RemoveBillCommand } from '../command/remove-bill.command';
import { BillIdNotFoundError } from '../../domain/exception/bill-id-not-found.error';

describe('RemoveBillHandler', () => {
  let command$: RemoveBillHandler;

  const bills: Partial<Bills> = {};

  const billId = BillId.fromString(uuid());
  const groupId = GroupId.fromString(uuid());
  const name = BillName.fromString('Bill Name');
  const amount = BillAmount.withMoneyAndCurrencyCode(
    BillCurrencyUnit.fromNumber(100),
    GroupCurrencyCode.fromString('EUR'),
  );

  const newPayers = [
    BillPayer.withMemberIdAndAmount(
      MemberId.fromString(uuid()),
      amount.money,
    ),
    BillPayer.withMemberIdAndAmount(
      MemberId.fromString(uuid()),
      amount.money,
    ),
  ];
  const newDebtors = [
    BillDebtor.withMemberIdAndAmount(
      MemberId.fromString(uuid()),
      amount.money,
    ),
    BillDebtor.withMemberIdAndAmount(
      MemberId.fromString(uuid()),
      amount.money,
    ),
  ];

  const date = BillDate.fromDate(new Date('2019-11-15T17:43:50'));
  const creatorId = MemberId.fromString(uuid());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveBillHandler,
        {
          provide: BILLS,
          useValue: bills,
        },
      ],
    }).compile();

    command$ = module.get<RemoveBillHandler>(RemoveBillHandler);
    bills.find = jest.fn().mockResolvedValue(null);
    bills.save = jest.fn();
  });

  it('should remove a bill', async () => {
    const bill =  Bill.add(billId, groupId, name, amount, date, newPayers, newDebtors, creatorId);
    bills.find = jest.fn().mockResolvedValue(bill);

    await command$.execute(new RemoveBillCommand(billId.value));

    expect(bills.save).toHaveBeenCalledTimes(1);
    expect(bills.save).toHaveBeenCalledWith(bill);
  });

  it('should throw an error if bill does not exists', async () => {
    bills.find = jest.fn().mockResolvedValue(null);

    expect(
      command$.execute(new RemoveBillCommand(groupId.value)),
    ).rejects.toThrow(BillIdNotFoundError);

    expect(bills.save).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if bill was removed', async () => {
    const bill =  Bill.add(billId, groupId, name, amount, date, newPayers, newDebtors, creatorId);

    bill.remove();
    bills.find = jest.fn().mockResolvedValue(bill);

    expect(
      command$.execute(new RemoveBillCommand(billId.value)),
    ).rejects.toThrow(BillIdNotFoundError);

    expect(bills.save).toHaveBeenCalledTimes(0);
  });
});