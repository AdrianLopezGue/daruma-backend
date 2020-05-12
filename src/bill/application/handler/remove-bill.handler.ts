import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveBillCommand } from '../command/remove-bill.command';
import { BILLS, Bills } from '../../domain/repository/index';
import { Bill } from '../../domain/model/bill';
import { BillId } from '../../domain/model/bill-id';
import { BillIdNotFoundError } from '../../domain/exception/bill-id-not-found.error';

@CommandHandler(RemoveBillCommand)
export class RemoveBillHandler implements ICommandHandler<RemoveBillCommand> {
  constructor(@Inject(BILLS) private readonly bills: Bills) {}

  async execute(command: RemoveBillCommand) {
    const billId = BillId.fromString(command.billId);
    const bill = await this.bills.find(billId);

    if (!(bill instanceof Bill) || bill.isRemoved) {
      throw BillIdNotFoundError.withString(command.billId);
    }

    bill.remove();
    this.bills.save(bill);
  }
}
