import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { CreateBillHandler } from './create-bill.handler';
import { BillId } from '../../domain/model/bill-id';
import { BillName } from '../../domain/model/bill-name';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillDate } from '../../domain/model/bill-date';
import { Bills } from '../../domain/repository/bills';
import { CreateBillCommand } from '../command/create-bill.command';
import { BILLS } from '../../domain/repository/index';
import { Bill } from '../../domain/model/bill';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillAmount } from '../../domain/model/bill-amount';
import { BillCurrencyUnit } from '../../domain/model/bill-currency-unit';
import { BillPayer } from '../../domain/model/bill-payer';
import { BillDebtor } from '../../domain/model/bill-debtor';
import { ParticipantDto } from '../../infrastructure/dto/bill.dto';
import { MemberId } from '../../../member/domain/model/member-id';

describe('CreateBillHandler', () => {
  let command$: CreateBillHandler;

  const bills: Partial<Bills> = {};

  const billId = BillId.fromString(v4());
  const groupId = GroupId.fromString(v4());
  const name = BillName.fromString('Bill name');
  const amount = BillAmount.withMoneyAndCurrencyCode(
    BillCurrencyUnit.fromBigInt(BigInt(100)),
    GroupCurrencyCode.fromString('EUR'),
  );
  const date = BillDate.fromDate(new Date('2019-11-15T17:43:50'));
  const payers = [
    new ParticipantDto('1111111', amount.money.value),
    new ParticipantDto('2222222', amount.money.value),

  ];

  const debtors = [
    new ParticipantDto('3333333', amount.money.value),
    new ParticipantDto('4444444', amount.money.value),

];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBillHandler,
        {
          provide: BILLS,
          useValue: bills,
        },
      ],
    }).compile();

    command$ = module.get<CreateBillHandler>(CreateBillHandler);
    bills.save = jest.fn();
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
        debtors
      ),
    );

    const billPayers = payers.map(payer =>
      BillPayer.withMemberIdAndAmount(
        MemberId.fromString(payer.id),
        BillCurrencyUnit.fromBigInt(payer.money),
      ),
    );

    const billDebtors = debtors.map(debtor =>
      BillDebtor.withMemberIdAndAmount(
        MemberId.fromString(debtor.id),
        BillCurrencyUnit.fromBigInt(debtor.money),
      ),
    );

    expect(bills.save).toHaveBeenCalledWith(
      Bill.add(
        billId,
        groupId,
        name,
        amount,
        date,
        billPayers,
        billDebtors
      ),
    );
  });
});
