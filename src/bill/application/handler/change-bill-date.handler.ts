import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BILLS, Bills } from '../../domain/repository/index';
import { BillId } from '../../domain/model/bill-id';
import { BillIdNotFoundError } from '../../domain/exception/bill-id-not-found.error';
import { Bill } from '../../domain/model/bill';
import { ChangeBillDateCommand } from '../command/change-bill-date.command';
import { BillDate } from '../../domain/model/bill-date';

@CommandHandler(ChangeBillDateCommand)
export class ChangeBillDateHandler
  implements ICommandHandler<ChangeBillDateCommand> {
  constructor(@Inject(BILLS) private readonly bills: Bills) {}

  async execute(command: ChangeBillDateCommand) {
    const billId = BillId.fromString(command.billId);
    const bill = await this.bills.find(billId);
    const date = BillDate.fromDate(command.date);

    if (!(bill instanceof Bill)) {
      throw BillIdNotFoundError.withString(command.billId);
    }

    bill.changeDate(date);
    this.bills.save(bill);
  }
}
