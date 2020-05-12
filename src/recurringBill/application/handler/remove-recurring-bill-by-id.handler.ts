import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  RECURRING_BILLS,
  RecurringBills,
} from '../../domain/repository/recurring-bills';
import { RecurringBillId } from '../../domain/model/recurring-bill-id';
import { RecurringBill } from '../../domain/model/recurring-bill';
import { RecurringBillIdNotFoundError } from '../../domain/exception/recurring-bill-id-not-found.error';
import { RemoveRecurringBillByBillIdCommand } from '../command/remove-recurring-bill-by-bill-id.command';
import {
  GET_RECURRING_BILL_ID_BY_BILL_ID,
  GetRecurringBillIdByBillId,
} from '../../domain/service/get-recurring-bill-by-bill-id.service';
import { BillId } from '../../../bill/domain/model/bill-id';

@CommandHandler(RemoveRecurringBillByBillIdCommand)
export class RemoveRecurringBillByBillIdHandler
  implements ICommandHandler<RemoveRecurringBillByBillIdCommand> {
  constructor(
    @Inject(RECURRING_BILLS) private readonly recurringBills: RecurringBills,
    @Inject(GET_RECURRING_BILL_ID_BY_BILL_ID)
    private readonly getRecurringBillIdByBillId: GetRecurringBillIdByBillId,
  ) {}

  async execute(command: RemoveRecurringBillByBillIdCommand) {
    const recurringBillIdValue = await this.getRecurringBillIdByBillId.with(
      BillId.fromString(command.billId),
    );

    const recurringBillId = RecurringBillId.fromString(recurringBillIdValue[0]);
    const recurringBill = await this.recurringBills.find(recurringBillId);

    if (!(recurringBill instanceof RecurringBill) || recurringBill.isRemoved) {
      throw RecurringBillIdNotFoundError.withString(recurringBillId.value);
    }

    recurringBill.remove();
    this.recurringBills.save(recurringBill);
  }
}
