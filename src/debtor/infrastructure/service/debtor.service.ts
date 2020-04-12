import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { CreateDebtorCommand } from '../../application/command/create-debtor.command';
import { DebtorView, DEBTOR_MODEL } from '../read-model/schema/debtor.schema';

@Injectable()
export class DebtorService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(DEBTOR_MODEL) private readonly debtorModel: Model<DebtorView>,
  ) {}

  async createDebtor(
    id: string,
    expenseId: string,
    memberId: string,
    money: bigint,
    currencyCode: string,
  ) {
    return this.commandBus.execute(
      new CreateDebtorCommand(id, expenseId, memberId, money, currencyCode),
    );
  }
}
