import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ChangeRecurringBillPeriodCommand } from '../command/change-recurring-bill-period.command';
import { RECURRING_BILLS, RecurringBills } from '../../domain/repository/recurring-bills';
import { RecurringBillId } from '../../domain/model/recurring-bill-id';
import { RecurringBill } from '../../domain/model/recurring-bill';
import { RecurringBillIdNotFoundError } from '../../domain/exception/recurring-bill-id-not-found.error';
import { RecurringBillPeriod } from '../../domain/model/recurring-bill-period';

@CommandHandler(ChangeRecurringBillPeriodCommand)
export class ChangeRecurringBillPeriodHandler
  implements ICommandHandler<ChangeRecurringBillPeriodCommand> {
  constructor(@Inject(RECURRING_BILLS) private readonly recurringBills: RecurringBills) {}

  async execute(command: ChangeRecurringBillPeriodCommand) {
    const recurringBillId = RecurringBillId.fromString(command.recurringBillId);
    const recurringBill = await this.recurringBills.find(recurringBillId);
    const period = RecurringBillPeriod.fromNumber(command.period);

    if (!(recurringBill instanceof RecurringBill)) {
      throw RecurringBillIdNotFoundError.withString(command.recurringBillId);
    }

    recurringBill.changePeriod(period);
    this.recurringBills.save(recurringBill);
  }
}