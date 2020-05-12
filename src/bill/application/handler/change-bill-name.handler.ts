import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ChangeBillNameCommand } from '../command/change-bill-name.command';
import { BILLS, Bills } from '../../domain/repository/index';
import { BillId } from '../../domain/model/bill-id';
import { BillName } from '../../domain/model/bill-name';
import { BillIdNotFoundError } from '../../domain/exception/bill-id-not-found.error';
import { Bill } from '../../domain/model/bill';

@CommandHandler(ChangeBillNameCommand)
export class ChangeBillNameHandler
  implements ICommandHandler<ChangeBillNameCommand> {
  constructor(@Inject(BILLS) private readonly bills: Bills) {}

  async execute(command: ChangeBillNameCommand) {
    const billId = BillId.fromString(command.billId);
    const bill = await this.bills.find(billId);
    const name = BillName.fromString(command.name);

    if (!(bill instanceof Bill)) {
      throw BillIdNotFoundError.withString(command.billId);
    }

    bill.rename(name);
    this.bills.save(bill);
  }
}
