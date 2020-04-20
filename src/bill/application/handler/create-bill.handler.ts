import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBillCommand } from '../command/create-bill.command';
import { BILLS } from '../../domain/repository/index';
import { BillId } from '../../domain/model/bill-id';
import { Bill } from '../../domain/model/bill';
import { BillName } from '../../domain/model/bill-name';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillDate } from '../../domain/model/bill-date';
import { Bills } from '../../domain/repository/bills';
import { BillAmount } from '../../domain/model/bill-amount';
import { BillCurrencyUnit } from '../../domain/model/bill-currency-unit';
import { BillPayer } from '../../domain/model/bill-payer';
import { BillDebtor } from '../../domain/model/bill-debtor';
import { MemberId } from '../../../member/domain/model/member-id';
import { MemberService } from '../../../member/infrastructure/service/member.service';
import { CreatorIdNotFoundInGroup } from '../../domain/exception/creator-id-not-found-in-group.error';

@CommandHandler(CreateBillCommand)
export class CreateBillHandler implements ICommandHandler<CreateBillCommand> {
  constructor(
    @Inject(BILLS) private readonly bills: Bills,
    private readonly memberService: MemberService,
  ) {}

  async execute(command: CreateBillCommand) {

    if (!(await this.memberService.checkIfMemberIsInGroup(command.groupId, command.creatorId))) {
      throw new CreatorIdNotFoundInGroup(command.creatorId);
    }

    const billId = BillId.fromString(command.billId);
    const groupId = BillId.fromString(command.groupId);
    const name = BillName.fromString(command.name);
    const amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromNumber(command.money),
      GroupCurrencyCode.fromString(command.currencyCode),
    );
    const payers = command.payers.map(payer =>
      BillPayer.withMemberIdAndAmount(
        MemberId.fromString(payer.id),
        BillCurrencyUnit.fromNumber(payer.money),
      ),
    );

    const debtors = command.debtors.map(debtor =>
      BillDebtor.withMemberIdAndAmount(
        MemberId.fromString(debtor.id),
        BillCurrencyUnit.fromNumber(debtor.money),
      ),
    );

    const creatorId = MemberId.fromString(command.creatorId);

    const date = BillDate.fromDate(command.date);

    const bill = Bill.add(
      billId,
      groupId,
      name,
      amount,
      date,
      payers,
      debtors,
      creatorId
    );

    this.bills.save(bill);
  }
}
