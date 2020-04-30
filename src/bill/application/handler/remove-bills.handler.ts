import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Bills, BILLS } from '../../domain/repository/index';
import { RemoveBillsCommand } from '../command/remove-bills.command';
import { BillService } from '../../infrastructure/service/bill.service';
import { BillId } from '../../domain/model/bill-id';
import { Bill } from '../../domain/model/bill';
import { BillIdNotFoundError } from '../../domain/exception/bill-id-not-found.error';

@CommandHandler(RemoveBillsCommand)
export class RemoveBillsHandler
  implements ICommandHandler<RemoveBillsCommand> {
  constructor(
    @Inject(BILLS) private readonly bills: Bills,
    private readonly billService: BillService,
  ) {}

  async execute(command: RemoveBillsCommand) {
    const billsId = await this.billService.getBillsIdByGroupId(command.groupId);
    const arr = Object.keys(billsId).map(function(id) {
      return billsId[id];
    });
    arr.map(
      async billId => {
        const newBillId = BillId.fromString(billId);
        const bill = await this.bills.find(newBillId);

        if (!(bill instanceof Bill) || bill.isRemoved) {
          throw BillIdNotFoundError.withString(billId);
        }

        bill.remove();
        this.bills.save(bill);
      }
    );
  }
}