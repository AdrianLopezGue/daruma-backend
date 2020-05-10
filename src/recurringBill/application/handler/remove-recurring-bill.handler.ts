import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveRecurringBillCommand } from '../command/remove-recurring-bill.command';
import { RECURRING_BILLS, RecurringBills } from '../../domain/repository/recurring-bills';
import { RecurringBillId } from '../../domain/model/recurring-bill-id';
import { RecurringBill } from '../../domain/model/recurring-bill';
import { RecurringBillIdNotFoundError } from '../../domain/exception/recurring-bill-id-not-found.error';


@CommandHandler(RemoveRecurringBillCommand)
export class RemoveRecurringBillHandler
  implements ICommandHandler<RemoveRecurringBillCommand> {
  constructor(
    @Inject(RECURRING_BILLS) private readonly recurringBills: RecurringBills,
  ) {}

  async execute(command: RemoveRecurringBillCommand) {

    const recurringBillId = RecurringBillId.fromString(command.recurringBillId);
    const recurringBill = await this.recurringBills.find(recurringBillId);

    if (!(recurringBill instanceof RecurringBill) || recurringBill.isRemoved) {
      throw RecurringBillIdNotFoundError.withString(recurringBillId.value);
    }

    recurringBill.remove();
    this.recurringBills.save(recurringBill);
  }
}