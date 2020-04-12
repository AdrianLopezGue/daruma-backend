import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { CreatePayerCommand } from '../../application/command/create-payer.command';
import { PayerView, PAYER_MODEL } from '../read-model/schema/payer.schema';

@Injectable()
export class PayerService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(PAYER_MODEL) private readonly payerModel: Model<PayerView>,
  ) {}

  async createPayer(id: string, expenseId: string, memberId: string, money: bigint, currencyCode: string) {
    return this.commandBus.execute(new CreatePayerCommand(id, expenseId, memberId, money, currencyCode));
  }
}
