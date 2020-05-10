import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRecurringBillCommand } from '../command/create-recurring-bill.command';
import { RECURRING_BILLS, RecurringBills } from '../../domain/repository/recurring-bills';
import { RecurringBillId } from '../../domain/model/recurring-bill-id';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillDate } from '../../../bill/domain/model/bill-date';
import { RecurringBillPeriod } from '../../domain/model/recurring-bill-period';
import { RecurringBill } from '../../domain/model/recurring-bill';
import { RecurringBillIdAlreadyRegisteredError } from '../../domain/exception/recurring-bill-id-already-registered.error';
import { BillId } from '../../../bill/domain/model/bill-id';


@CommandHandler(CreateRecurringBillCommand)
export class CreateRecurringBillHandler implements ICommandHandler<CreateRecurringBillCommand> {
  constructor(
    @Inject(RECURRING_BILLS) private readonly recurringBills: RecurringBills,
  ) {}

  async execute(command: CreateRecurringBillCommand) {
    const recurringBillId = RecurringBillId.fromString(command.recurringBillId);
    const billId = BillId.fromString(command.billId);
    const groupId = GroupId.fromString(command.groupId);
    const date = BillDate.fromDate(command.date);
    const period = RecurringBillPeriod.fromNumber(command.period);

    if ((await this.recurringBills.find(recurringBillId)) instanceof RecurringBill) {
      throw RecurringBillIdAlreadyRegisteredError.withString(command.recurringBillId);
    }

    const recurringBill = RecurringBill.add(recurringBillId, billId, groupId, date, period);

    this.recurringBills.save(recurringBill);
  }
}
