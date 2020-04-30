import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Model } from 'mongoose';
import {
  BALANCE_MODEL,
  BalanceView,
} from '../read-model/schema/balance.transaction.schema';
@Injectable()
export class BalanceService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(BALANCE_MODEL) private readonly balanceModel: Model<BalanceView>,
  ) {}

  async getBalance(idGroup: string): Promise<BalanceView[]> {
    return this.balanceModel.find({ idGroup: '' + idGroup + '' }).exec();
  }

  async deleteBalances(idGroup: string){
    this.balanceModel.deleteMany({ idGroup: '' + idGroup + '' }).exec();
  }
}
