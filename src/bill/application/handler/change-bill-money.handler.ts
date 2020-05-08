import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BILLS, Bills } from '../../domain/repository/index';
import { BillId } from '../../domain/model/bill-id';
import { BillIdNotFoundError } from '../../domain/exception/bill-id-not-found.error';
import { Bill } from '../../domain/model/bill';
import { ChangeBillMoneyCommand } from '../command/change-bill-money.command';
import { BillCurrencyUnit } from '../../domain/model/bill-currency-unit';

@CommandHandler(ChangeBillMoneyCommand)
export class ChangeBillMoneyHandler
  implements ICommandHandler<ChangeBillMoneyCommand> {
  constructor(@Inject(BILLS) private readonly bills: Bills) {}

  async execute(command: ChangeBillMoneyCommand) {
    const billId = BillId.fromString(command.billId);
    const bill = await this.bills.find(billId);
    const money = BillCurrencyUnit.fromNumber(command.money);

    if (!(bill instanceof Bill)) {
      throw BillIdNotFoundError.withString(command.billId);
    }

    bill.changeMoney(money);
    this.bills.save(bill);
  }
}