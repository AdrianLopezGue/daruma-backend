import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { Bills } from '../../../bill/domain/repository';
import { BillId } from '../../domain/model/bill-id';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillName } from '../../domain/model/bill-name';
import { BillAmount } from '../../domain/model/bill-amount';
import { BillCurrencyUnit } from '../../domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillDate } from '../../domain/model/bill-date';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillPayer } from '../../domain/model/bill-payer';
import { BillDebtor } from '../../domain/model/bill-debtor';
import { BILLS } from '../../domain/repository/index';
import { Bill } from '../../domain/model/bill';
import { BillIdNotFoundError } from '../../domain/exception/bill-id-not-found.error';
import { ChangeBillMoneyHandler } from './change-bill-money.handler';
import { ChangeBillMoneyCommand } from '../command/change-bill-money.command';


describe('ChangeBillMoneyHandler', () => {
  let command$: ChangeBillMoneyHandler;

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
        ChangeBillMoneyHandler,
        {
          provide: BILLS,
          useValue: bills,
        },
      ],
    }).compile();

    command$ = module.get<ChangeBillMoneyHandler>(ChangeBillMoneyHandler);
    bills.find = jest.fn().mockResolvedValue(null);
    bills.save = jest.fn();
  });

  it('should change bill money', async () => {
    const bill =  Bill.add(billId, groupId, name, amount, date, newPayers, newDebtors, creatorId);
    const newMoney = BillCurrencyUnit.fromNumber(200);


    bills.find = jest.fn().mockResolvedValue(bill);
    bill.changeMoney(newMoney);

    await command$.execute(
      new ChangeBillMoneyCommand(billId.value, newMoney.value),
    );

    expect(bills.save).toHaveBeenCalledTimes(1);
    expect(bills.save).toHaveBeenCalledWith(bill);
  });

  it('should throw an error if bill does not exists', async () => {
    expect(
      command$.execute(new ChangeBillMoneyCommand(billId.value, 200)),
    ).rejects.toThrow(BillIdNotFoundError);

    expect(bills.save).toHaveBeenCalledTimes(0);
  });
});